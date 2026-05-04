import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 140
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      max: 25
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 32
    },
    fulfillmentType: {
      type: String,
      enum: ["pickup", "dine-in", "delivery"],
      default: "pickup"
    },
    requestedTime: {
      type: Date,
      required: true
    },
    address: {
      type: String,
      trim: true,
      maxlength: 300
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500
    },
    items: {
      type: [orderItemSchema],
      validate: [(items) => items.length > 0, "At least one item is required."]
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    paymentMode: {
      type: String,
      enum: ["pay-at-cafe", "upi-on-confirmation"],
      default: "pay-at-cafe"
    },
    source: {
      type: String,
      default: "website"
    },
    status: {
      type: String,
      enum: ["new", "pending", "accepted", "preparing", "ready", "completed", "delivered", "cancelled"],
      default: "new"
    }
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
