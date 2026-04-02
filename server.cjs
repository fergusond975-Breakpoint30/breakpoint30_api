// server.cjs
// BreakPoint30 backend — live data with safety nets

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

// ---- SAFETY WRAPPER ----
// Ensures we never crash if a scraper fails or returns bad data
function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

// ---- SCRAPERS ----
// These should be your real scrapers. If one fails, server stays alive.

async function fetchLoves() {
  try {
    const res = await axios.get("https://your-loves-endpoint-or-scraper");
    return safeArray(res.data);
  } catch (err) {
    console.error("Loves scraper failed:", err.message);
    return [];
  }
}

async function fetchPilot() {
  try {
    const res = await axios.get("https://your-pilot-endpoint-or-scraper");
    return safeArray(res.data);
  } catch (err) {
    console.error("Pilot scraper failed:", err.message);
    return [];
  }
}

async function fetchTA() {
  try {
    const res = await axios.get("https://your-ta-endpoint-or-scraper");
    return safeArray(res.data);
  } catch (err) {
    console.error("TA scraper failed:", err.message);
    return [];
  }
}

// ---- ROUTES ----

app.get("/", (req, res) => {
  res.send("BreakPoint30 backend is running");
});

app.get("/truckstops", async (req, res) => {
  try {
    const [loves, pilot, ta] = await Promise.all([
      fetchLoves(),
      fetchPilot(),
      fetchTA(),
    ]);

    const combined = [
      ...safeArray(loves),
      ...safeArray(pilot),
      ...safeArray(ta),
    ];

    res.json(combined);
  } catch (err) {
    console.error("Truckstops route failed:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ---- START SERVER ----

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`BreakPoint30 backend running on port ${PORT}`);
});
