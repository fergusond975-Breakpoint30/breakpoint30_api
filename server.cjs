// ===============================
// BreakPoint30 API Server (server.cjs)
// Clean, Render-safe, cockpit-grade
// ===============================

const express = require("express");
const cors = require("cors");
const axios = require("axios");

// Safe array helper
function safeArray(arr) {
  return Array.isArray(arr) ? arr : [];
}

// -------------------------------
// Love's Scraper (Correct POST Body - VERIFIED WORKING)
// -------------------------------
async function fetchLoves() {
  try {
    const url = "https://www.loves.com/api/locations/search";

    const response = await axios.post(
      url,
      {
        page: 1,
        pageSize: 5000,
        sort: "distance",
        filters: {
          amenities: [],
          fuelTypes: [],
          hasRVHookups: false,
          hasTirePass: false,
          hasServiceCenter: false,
          hasSpeedco: false,
          hasTruckWash: false,
          hasScale: false,
          hasTransflow: false,
          hasLaundry: false,
          hasShowers: false,
          hasCATScale: false,
          hasDEF: false,
          hasATM: false,
          hasWiFi: false,
          hasPropane: false,
          hasRVDump: false,
          hasDogPark: false,
          hasPrivateShowers: false,
          hasBulkDEF: false,
          hasTirePassTruck: false,
          hasTirePassRV: false,
          hasTirePassAuto: false,
          hasTirePassTrailer: false,
          hasTirePassBus: false,
          hasTirePassOther: false
        }
      },
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Content-Type": "application/json"
        }
      }
    );

    const locations = response.data?.results || [];

    const stops = locations.map((loc) => ({
      brand: "Loves",
      name: loc.name || "",
      address: loc.address1 || "",
      city: loc.city || "",
      state: loc.state || "",
      lat: loc.latitude || null,
      lng: loc.longitude || null,
    }));

    return safeArray(stops);
  } catch (err) {
    console.error("Love's scraper failed:", err.message);
    return [];
  }
}

// -------------------------------
// Express App
// -------------------------------
const app = express();
app.use(cors());
app.use(express.json());

// Root test route
app.get("/", (req, res) => {
  res.json({ status: "BreakPoint30 API is running" });
});

// Love's route
app.get("/truckstops/loves", async (req, res) => {
  const data = await fetchLoves();
  res.json(data);
});

// -------------------------------
// Port Binding (Render REQUIRED)
// -------------------------------
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`BreakPoint30 API running on port ${PORT}`);
});
