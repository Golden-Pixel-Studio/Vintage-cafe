import "dotenv/config";
import cors from "cors";
import crypto from "crypto";
import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import Order from "./models/Order.js";
import { fallbackBusiness } from "../src/data/cafeData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 5050;
const memoryOrders = [];
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Vintage@7517773756";
const adminAccessToken = crypto.randomBytes(32).toString("hex");
const ADMIN_ORDER_STATUSES = new Set(["new", "pending", "delivered", "cancelled"]);

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN ? process.env.CLIENT_ORIGIN.split(",") : true
  })
);
app.use(express.json({ limit: "1mb" }));

let mongoReady = false;

function getConfiguredFallbackBusiness() {
  return {
    ...fallbackBusiness,
    whatsapp: process.env.WHATSAPP_NUMBER || fallbackBusiness.whatsapp
  };
}

function passwordsMatch(password) {
  const configuredHash = crypto.createHash("sha256").update(ADMIN_PASSWORD).digest();
  const suppliedHash = crypto.createHash("sha256").update(String(password || "")).digest();
  return crypto.timingSafeEqual(configuredHash, suppliedHash);
}

function hasAdminAccess(request) {
  const header = request.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!token) return false;

  const supplied = Buffer.from(token);
  const expected = Buffer.from(adminAccessToken);
  return supplied.length === expected.length && crypto.timingSafeEqual(supplied, expected);
}

function requireAdmin(request, response, next) {
  if (!hasAdminAccess(request)) {
    response.status(401).json({ message: "Admin password required." });
    return;
  }

  next();
}

async function connectMongo() {
  if (!process.env.MONGODB_URI) {
    console.log("MongoDB not configured. Orders will use in-memory demo storage.");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    mongoReady = true;
    console.log("MongoDB connected for Vintage Cafe orders.");
  } catch (error) {
    console.warn("MongoDB connection failed. Falling back to in-memory demo storage.", error.message);
  }
}

function createOrderNumber() {
  const dayStamp = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `VC-${dayStamp}-${random}`;
}

function normalizeOrder(body) {
  const items = Array.isArray(body.items)
    ? body.items.map((item) => ({
        name: String(item.name || "").trim(),
        quantity: Number(item.quantity),
        price: Number(item.price)
      }))
    : [];

  const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return {
    orderNumber: createOrderNumber(),
    customerName: String(body.customerName || "").trim(),
    phone: String(body.phone || "").trim(),
    fulfillmentType: ["pickup", "dine-in", "delivery"].includes(body.fulfillmentType)
      ? body.fulfillmentType
      : "pickup",
    requestedTime: new Date(body.requestedTime),
    address: String(body.address || "").trim(),
    notes: String(body.notes || "").trim(),
    items,
    totalAmount,
    paymentMode: ["pay-at-cafe", "upi-on-confirmation"].includes(body.paymentMode)
      ? body.paymentMode
      : "pay-at-cafe"
  };
}

function isValidOrder(order) {
  return (
    order.customerName.length >= 2 &&
    order.phone.length >= 7 &&
    !Number.isNaN(order.requestedTime.getTime()) &&
    order.items.length > 0 &&
    order.items.every(
      (item) =>
        item.name.length >= 2 &&
        Number.isFinite(item.quantity) &&
        item.quantity >= 1 &&
        item.quantity <= 25 &&
        Number.isFinite(item.price) &&
        item.price >= 0
    )
  );
}

function getPhotoProxyUrl(reference) {
  return `/api/place-photo/${encodeURIComponent(reference)}`;
}

async function fetchGoogleBusiness() {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) return null;
  const configuredFallback = getConfiguredFallbackBusiness();

  let placeId = process.env.GOOGLE_PLACE_ID;

  if (!placeId) {
    const findUrl = new URL("https://maps.googleapis.com/maps/api/place/findplacefromtext/json");
    findUrl.searchParams.set("input", `${configuredFallback.name}, ${configuredFallback.address}`);
    findUrl.searchParams.set("inputtype", "textquery");
    findUrl.searchParams.set("fields", "place_id");
    findUrl.searchParams.set("key", key);

    const findResponse = await fetch(findUrl);
    const findPayload = await findResponse.json();
    placeId = findPayload?.candidates?.[0]?.place_id;
  }

  if (!placeId) return null;

  const detailsUrl = new URL("https://maps.googleapis.com/maps/api/place/details/json");
  detailsUrl.searchParams.set("place_id", placeId);
  detailsUrl.searchParams.set(
    "fields",
    "name,formatted_address,formatted_phone_number,rating,user_ratings_total,opening_hours,photos,reviews,geometry,url,website"
  );
  detailsUrl.searchParams.set("key", key);

  const detailsResponse = await fetch(detailsUrl);
  const detailsPayload = await detailsResponse.json();
  const result = detailsPayload?.result;
  if (!result) return null;

  const photos = (result.photos || []).slice(0, 8).map((photo, index) => ({
    title: `${result.name || fallbackBusiness.name} photo ${index + 1}`,
    type: "Google Places",
    image: getPhotoProxyUrl(photo.photo_reference)
  }));

  return {
    name: result.name || configuredFallback.name,
    address: result.formatted_address || configuredFallback.address,
    phoneDisplay: configuredFallback.phoneDisplay,
    phone: configuredFallback.phone,
    whatsapp: configuredFallback.whatsapp,
    rating: result.rating || configuredFallback.rating,
    reviewCount: result.user_ratings_total || configuredFallback.reviewCount,
    openingHours: result.opening_hours?.weekday_text || configuredFallback.openingHours,
    coordinates: result.geometry?.location || configuredFallback.coordinates,
    mapEmbed: configuredFallback.mapEmbed,
    googleUrl: result.url,
    website: result.website,
    photos,
    googleReviews: (result.reviews || []).slice(0, 5),
    liveDataStatus: "Live Google Places data loaded."
  };
}

app.get("/api/health", (_request, response) => {
  response.json({
    ok: true,
    mongoReady
  });
});

app.get("/api/business", async (_request, response) => {
  try {
    const liveBusiness = await fetchGoogleBusiness();
    response.json({
      business: liveBusiness || getConfiguredFallbackBusiness(),
      live: Boolean(liveBusiness)
    });
  } catch (error) {
    console.warn("Google Places lookup failed. Returning fallback business data.", error.message);
    response.json({
      business: getConfiguredFallbackBusiness(),
      live: false
    });
  }
});

app.get("/api/place-photo/:reference", async (request, response) => {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) {
    response.status(404).json({ message: "Google Places API key not configured." });
    return;
  }

  const photoUrl = new URL("https://maps.googleapis.com/maps/api/place/photo");
  photoUrl.searchParams.set("maxwidth", "1400");
  photoUrl.searchParams.set("photo_reference", request.params.reference);
  photoUrl.searchParams.set("key", key);
  response.redirect(photoUrl.toString());
});

app.post("/api/admin/login", (request, response) => {
  if (!passwordsMatch(request.body?.password)) {
    response.status(401).json({ message: "Incorrect admin password." });
    return;
  }

  response.json({
    token: adminAccessToken,
    message: "Admin access granted."
  });
});

app.get("/api/admin/orders", requireAdmin, async (_request, response) => {
  if (mongoReady) {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(200).lean();
    response.json({ mongoReady, orders });
    return;
  }

  response.json({ mongoReady, orders: memoryOrders });
});

app.patch("/api/admin/orders/:id/status", requireAdmin, async (request, response) => {
  const status = String(request.body?.status || "").trim();
  if (!ADMIN_ORDER_STATUSES.has(status)) {
    response.status(400).json({ message: "Choose a valid order status." });
    return;
  }

  if (mongoReady) {
    const query = request.params.id.match(/^[a-f\d]{24}$/i)
      ? { _id: request.params.id }
      : { orderNumber: request.params.id };
    const order = await Order.findOneAndUpdate(query, { status }, { new: true, runValidators: true }).lean();

    if (!order) {
      response.status(404).json({ message: "Order not found." });
      return;
    }

    response.json({ mongoReady, order, message: "Order status updated." });
    return;
  }

  const index = memoryOrders.findIndex((item) => item.id === request.params.id || item.orderNumber === request.params.id);
  if (index === -1) {
    response.status(404).json({ message: "Order not found. In-memory demo orders are cleared when the server restarts." });
    return;
  }

  memoryOrders[index] = {
    ...memoryOrders[index],
    status,
    updatedAt: new Date()
  };
  response.json({ mongoReady, order: memoryOrders[index], message: "Order status updated." });
});

app.post("/api/orders", async (request, response) => {
  const payload = normalizeOrder(request.body);

  if (!isValidOrder(payload)) {
    response.status(400).json({
      message: "Please add at least one item and enter a valid name, phone, and requested time."
    });
    return;
  }

  try {
    if (mongoReady) {
      const order = await Order.create(payload);
      response.status(201).json({
        id: order._id,
        orderNumber: order.orderNumber,
        order,
        message: "Your online order has been received. Vintage Cafe will confirm it shortly."
      });
      return;
    }

    const demoOrder = {
      id: `demo-${Date.now()}`,
      ...payload,
      status: "new",
      createdAt: new Date()
    };
    memoryOrders.unshift(demoOrder);
    response.status(201).json({
      id: demoOrder.id,
      orderNumber: demoOrder.orderNumber,
      order: demoOrder,
      message: "Demo order captured. Add MongoDB to persist orders in production."
    });
  } catch (error) {
    console.error("Order failed", error);
    response.status(500).json({
      message: "Online ordering is temporarily unavailable. Please call the cafe."
    });
  }
});

app.get("/api/orders", requireAdmin, async (_request, response) => {
  if (mongoReady) {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(100).lean();
    response.json({ mongoReady, orders });
    return;
  }

  response.json({ mongoReady, orders: memoryOrders });
});

app.get("/api/orders/:id", requireAdmin, async (request, response) => {
  if (mongoReady) {
    const query = request.params.id.match(/^[a-f\d]{24}$/i)
      ? { _id: request.params.id }
      : { orderNumber: request.params.id };
    const order = await Order.findOne(query).lean();

    if (!order) {
      response.status(404).json({ message: "Order not found." });
      return;
    }

    response.json({ mongoReady, order });
    return;
  }

  const order = memoryOrders.find((item) => item.id === request.params.id || item.orderNumber === request.params.id);
  if (!order) {
    response.status(404).json({ message: "Order not found. In-memory demo orders are cleared when the server restarts." });
    return;
  }

  response.json({ mongoReady, order });
});

app.use(express.static(path.join(__dirname, "../dist")));

app.get("*", (_request, response) => {
  response.sendFile(path.join(__dirname, "../dist/index.html"));
});

connectMongo().finally(() => {
  app.listen(PORT, () => {
    console.log(`Vintage Cafe server running on http://localhost:${PORT}`);
  });
});
