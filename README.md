# Vintage Cafe Premium Website

Production-ready React + Vite website for Vintage Cafe, Kondhwa Budruk, Pune.

## What is included

- Premium responsive cafe landing page with dark and light mode
- Fullscreen cafe video hero with fallback poster image
- Framer Motion scroll animations, parallax, hover micro-interactions, and success states
- Menu categories for Coffee, Snacks, and Desserts
- Masonry gallery with lazy-loaded images and lightbox preview
- Reviews carousel and public-rating fallback data
- Google Maps embed and Google Places-ready business data route
- WhatsApp chat button, click-to-call, newsletter form, and online order form
- Password-protected admin orders dashboard at `/admin`
- Express API with optional MongoDB persistence for orders
- SEO meta tags, Schema.org JSON-LD, manifest, service worker, robots, and sitemap

## Folder structure

```txt
Vintage Cafe/
  backend/
    models/Order.js
    server.js
  public/
    manifest.webmanifest
    robots.txt
    sitemap.xml
    sw.js
    vintage-icon.svg
  src/
    data/cafeData.js
    App.jsx
    index.css
    main.jsx
  .env.example
  index.html
  package.json
  postcss.config.js
  tailwind.config.js
  vite.config.js
```

## Setup

```bash
cd "Vintage Cafe"
npm install
cp .env.example .env
npm run dev
```

Frontend runs on `http://localhost:5173`.
Backend runs on `http://localhost:5050`.

## Environment variables

```bash
PORT=5050
CLIENT_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/vintage-cafe
GOOGLE_PLACES_API_KEY=your_google_places_api_key
GOOGLE_PLACE_ID=
WHATSAPP_NUMBER=917517773756
ADMIN_PASSWORD=Vintage@7517773756
```

`MONGODB_URI` is optional. If it is missing, orders are held in in-memory demo storage.
`ADMIN_PASSWORD` controls access to the `/admin` order dashboard.

## Admin orders

While the local server is running, open:

```txt
http://localhost:5173/admin
```

Login with `ADMIN_PASSWORD` to review new, pending, and delivered orders. The admin page can also update order status.
Use the `Enable Sound` button on the admin page to hear a chime whenever a new order arrives. Keep the admin page open so it can auto-check for orders.

If `MONGODB_URI` is configured, order details are saved permanently in MongoDB under the `orders` collection.

`GOOGLE_PLACES_API_KEY` is optional. If it is missing, the site uses realistic public-directory fallback data gathered for the provided address. Add `GOOGLE_PLACE_ID` for faster and more accurate lookups.

## Business data sources

The app is wired for Google Places, but because Google API access requires credentials, fallback data is based on public directory listings:

- TripTap: address, phone, overview, and hours
- Zaubee: rating around 4.3 with 300 reviews
- Yappe: rating around 4.2 with 243 reviews and address confirmation
- Magicpin: menu highlights, cost for two, visits, and popular items
- Restaurant Guru: recent hours and dish recommendations

Before final client handoff, verify live hours and photos with the business owner or a Google Places API key.

## Production build

```bash
npm run build
npm run preview
```

## Deploy frontend to Vercel or Netlify

Use these settings:

- Build command: `npm run build`
- Publish directory: `dist`
- Node version: `20`

If deploying only the frontend, forms will use fallback behavior unless you also deploy the Express API.

## Deploy full stack

Recommended options:

1. Vercel frontend + Render/Railway backend
2. Netlify frontend + Render/Railway backend
3. Single Node host serving `dist` through `backend/server.js`

For a single Node host:

```bash
npm install
npm run build
npm start
```

Set production environment variables in the hosting dashboard.

## Google Maps and Places

The embedded map works without a key using:

```txt
https://www.google.com/maps?q=<encoded address>&output=embed
```

Live details are loaded from:

```txt
GET /api/business
```

When `GOOGLE_PLACES_API_KEY` is configured, the backend attempts a Google Places lookup and returns live rating, review count, hours, phone, and photo proxy URLs.

## Notes for client polish

- Replace placeholder social links in `Footer` with real Instagram/Facebook URLs.
- Replace `https://vintage-cafe.example.com` in `index.html`, `robots.txt`, and `sitemap.xml` with the production domain.
- Add official cafe photos or enable Google Places photos for the strongest authenticity.
- Add Razorpay only if the cafe wants paid table deposits or event booking payments.
