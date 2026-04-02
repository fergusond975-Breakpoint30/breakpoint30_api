// ===============================
// BreakPoint30 API Server (server.cjs)
// Clean, Render-safe, cockpit-grade
// ===============================

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");

// Safe array helper
function safeArray(arr) {
  return Array.isArray(arr) ? arr : [];
}

// -------------------------------
// Love's Scraper (JSON Extraction)
// -------------------------------
async function fetchLoves() {
  try {
    const url = "https://www.loves.com/en/locations";

    const response = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const html = response.data;

    // Love's embeds JSON inside a script tag
    const jsonMatch = html.match(/window\.__INITIAL_STATE__ = ({.*});/);

    if (!jsonMatch) {
      console.error("Could not find embedded Love's JSON");
      return [];
    }

    const json = JSON.parse(jsonMatch[1]);

    const locations = json?.locations?.locationResults || [];

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
