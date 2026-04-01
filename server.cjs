import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

// -----------------------------
// SMALL REAL FALLBACK LISTS
// -----------------------------

const fallbackLoves = [
  { brand: "Loves", name: "Love's Travel Stop", city: "Joplin", state: "MO", lat: 37.0842, lon: -94.5133 },
  { brand: "Loves", name: "Love's Travel Stop", city: "Seville", state: "OH", lat: 41.0101, lon: -81.8626 },
  { brand: "Loves", name: "Love's Travel Stop", city: "Barstow", state: "CA", lat: 34.8644, lon: -117.0564 }
];

const fallbackPilot = [
  { brand: "Pilot", name: "Pilot Travel Center", city: "Knoxville", state: "TN", lat: 35.9606, lon: -83.9207 },
  { brand: "Pilot", name: "Flying J Travel Center", city: "Salt Lake City", state: "UT", lat: 40.7608, lon: -111.8910 },
  { brand: "Pilot", name: "Pilot Travel Center", city: "Amarillo", state: "TX", lat: 35.221997, lon: -101.831299 }
];

const fallbackTA = [
  { brand: "TA", name: "TA Travel Center", city: "Wheat Ridge", state: "CO", lat: 39.7661, lon: -105.0772 },
  { brand: "Petro", name: "Petro Stopping Center", city: "Kingman", state: "AZ", lat: 35.1894, lon: -114.0530 },
  { brand: "TA", name: "TA Express", city: "Grand Island", state: "NE", lat: 40.9264, lon: -98.3420 }
];

// -----------------------------
// SAFE FETCH WRAPPER
// -----------------------------
async function safeFetch(url) {
  try {
    const res = await fetch(url, { timeout: 8000 });
    if (!res.ok) throw new Error("Bad response");
    return await res.json();
  } catch {
    return null;
  }
}

// -----------------------------
// TRUCK STOP ROUTE
// -----------------------------
app.get("/truckstops", async (req, res) => {
  let allStops = [];

  // -----------------------------
  // 1. LOVE'S REAL-TIME
  // -----------------------------
  const lovesData = await safeFetch("https://www.loves.com/api/locations");

  if (lovesData && Array.isArray(lovesData)) {
    const mapped = lovesData.slice(0, 20).map((loc) => ({
      brand: "Loves",
      name: loc.Name || "Love's Travel Stop",
      city: loc.City,
      state: loc.State,
      lat: loc.Latitude,
      lon: loc.Longitude
    }));
    allStops.push(...mapped);
  } else {
    allStops.push(...fallbackLoves);
  }

  // -----------------------------
  // 2. PILOT REAL-TIME
  // -----------------------------
  const pilotData = await safeFetch("https://www.pilotflyingj.com/api/locations");

  if (pilotData && Array.isArray(pilotData)) {
    const mapped = pilotData.slice(0, 20).map((loc) => ({
      brand: "Pilot",
      name: loc.name || "Pilot Travel Center",
      city: loc.city,
      state: loc.state,
      lat: loc.latitude,
      lon: loc.longitude
    }));
    allStops.push(...mapped);
  } else {
    allStops.push(...fallbackPilot);
  }

  // -----------------------------
  // 3. TA / PETRO (FALLBACK ONLY)
  // -----------------------------
  allStops.push(...fallbackTA);

  // -----------------------------
  // RETURN CLEAN LIST
  // -----------------------------
  res.json(allStops);
});

// -----------------------------
app.get("/", (req, res) => {
  res.json({ status: "BreakPoint30 API is running" });
});

// -----------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`BreakPoint30 API running on port ${PORT}`);
});
