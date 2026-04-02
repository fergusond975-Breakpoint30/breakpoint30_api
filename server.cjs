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
// Love's Scraper (ArcGIS Endpoint - WORKING)
// -------------------------------
async function fetchLoves() {
  try {
    const url =
      "https://services.arcgis.com/8DAUcrpQcpyLMznu/ArcGIS/rest/services/Loves_Locations/FeatureServer/0/query";

    const response = await axios.get(url, {
      params: {
        where: "1=1",
        outFields: "*",
        f: "json",
      },
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const features = response.data?.features || [];

    const stops = features.map((f) => ({
      brand: "Loves",
      name: f.attributes?.Name || "",
      address: f.attributes?.Address || "",
      city: f.attributes?.City || "",
      state: f.attributes?.State || "",
      lat: f.geometry?.y || null,
      lng: f.geometry?.x || null,
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
