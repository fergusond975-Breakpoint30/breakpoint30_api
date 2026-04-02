// ===============================
// BreakPoint30 API Server (server.cjs)
// ===============================

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

// Helper
function safeArray(arr) {
  return Array.isArray(arr) ? arr : [];
}

// -------------------------------
// Love's Scraper (Nationwide Grid Scan)
// -------------------------------
async function fetchLoves() {
  const gridPoints = [
    { lat: 40.0, lng: -100.0 },
    { lat: 35.0, lng: -90.0 },
    { lat: 45.0, lng: -110.0 },
    { lat: 30.0, lng: -95.0 },
    { lat: 42.0, lng: -85.0 },
  ];

  let all = [];

  for (const point of gridPoints) {
    try {
      const response = await axios.post(
        "https://www.loves.com/api/locations/search",
        {
          page: 1,
          pageSize: 5000,
          latitude: point.lat,
          longitude: point.lng,
          radiusMiles: 500,
          filters: {},
        },
        {
          headers: {
            "User-Agent": "Mozilla/5.0",
            "Content-Type": "application/json",
          },
        }
      );

      const results = response.data?.results || [];
      all.push(...results);
    } catch (err) {
      console.error("Love's scan failed:", err.message);
    }
  }

  // Deduplicate by store number
  const unique = {};
  for (const loc of all) {
    unique[loc.storeNumber] = loc;
  }

  const final = Object.values(unique).map((loc) => ({
    brand: "Loves",
    name: loc.name || "",
    address: loc.address1 || "",
    city: loc.city || "",
    state: loc.state || "",
    lat: loc.latitude || null,
    lng: loc.longitude || null,
  }));

  return safeArray(final);
}

// -------------------------------
// Routes
// -------------------------------
app.get("/", (req, res) => {
  res.json({ status: "BreakPoint30 API is running" });
});

app.get("/truckstops/loves", async (req, res) => {
  const data = await fetchLoves();
  res.json(data);
});

// -------------------------------
// Port Binding
// -------------------------------
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`BreakPoint30 API running on port ${PORT}`));
