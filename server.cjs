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
// Love's Scraper (Quick Fix Version)
// -------------------------------
async function fetchLoves() {
  try {
    const url = "https://www.loves.com/en/locations";

    const response = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const html = response.data;
    const $ = cheerio.load(html);

    const stops = [];

    // Updated selector for 2024–2025 Love's layout
    $(".location-result-item").each((i, el) => {
      const name = $(el).find(".location-result-item__title").text().trim();
      const address = $(el).find(".location-result-item__address").text().trim();
      const city = $(el).find(".location-result-item__city").text().trim();
      const state = $(el).find(".location-result-item__state").text().trim();

      const lat = $(el).attr("data-lat");
      const lng = $(el).attr("data-lng");

      stops.push({
        brand: "Loves",
        name,
        address,
        city,
        state,
        lat: lat ? Number(lat) : null,
        lng: lng ? Number(lng) : null,
      });
    });

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
