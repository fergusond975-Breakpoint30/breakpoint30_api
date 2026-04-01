import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

// --------------------------------------
// PERMANENT TRUCK STOP DATA STRUCTURE
// --------------------------------------
// This is where the REAL nationwide list goes.
// One time only. No manual ongoing updates.
// Each item = one real truck stop from a trusted source.
const TRUCK_STOPS = [
  // EXAMPLE REAL ENTRIES (KEEP ONLY IF THEY'RE TRUE)
  // { id: "loves-joplin-mo-1", brand: "Loves", name: "Love's Travel Stop", city: "Joplin", state: "MO", lat: 37.0842, lon: -94.5133 },
  // { id: "pilot-amarillo-tx-1", brand: "Pilot", name: "Pilot Travel Center", city: "Amarillo", state: "TX", lat: 35.221997, lon: -101.831299 },
  // ...
  // TODO: Replace this comment with the full nationwide dataset
];

// --------------------------------------
// HELPER: HAVERSINE DISTANCE (MILES)
// --------------------------------------
function toRad(deg) {
  return (deg * Math.PI) / 180;
}

function distanceMiles(lat1, lon1, lat2, lon2) {
  const R = 3958.8; // Earth radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// --------------------------------------
// /truckstops — NEAREST STOPS BY LOCATION
// --------------------------------------
// Query params:
//   ?lat=...&lon=...&radius=50&limit=20
app.get("/truckstops", (req, res) => {
  const { lat, lon, radius = 50, limit = 20 } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "lat and lon are required query parameters" });
  }

  const userLat = parseFloat(lat);
  const userLon = parseFloat(lon);
  const maxRadius = parseFloat(radius);
  const maxResults = parseInt(limit, 10);

  if (TRUCK_STOPS.length === 0) {
    return res.status(503).json({
      error: "Truck stop dataset not loaded",
      message: "Backend is ready, but nationwide stop list has not been populated yet."
    });
  }

  const withDistance = TRUCK_STOPS.map((stop) => {
    const dist = distanceMiles(userLat, userLon, stop.lat, stop.lon);
    return { ...stop, distanceMiles: dist };
  });

  const nearby = withDistance
    .filter((s) => s.distanceMiles <= maxRadius)
    .sort((a, b) => a.distanceMiles - b.distanceMiles)
    .slice(0, maxResults);

  res.json(nearby);
});

// --------------------------------------
app.get("/", (req, res) => {
  res.json({ status: "BreakPoint30 API is running", stopsLoaded: TRUCK_STOPS.length });
});

// --------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`BreakPoint30 API running on port ${PORT}`);
});
