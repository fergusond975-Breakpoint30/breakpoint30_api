const express = require("express");
const cors = require("cors");

// Load nationwide truck stops from stops.js
const TRUCK_STOPS = require("./stops.js");

const app = express();
app.use(cors());

// -----------------------------
// Helper: Haversine distance
// -----------------------------
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

// -----------------------------
// GET /truckstops
// -----------------------------
app.get("/truckstops", (req, res) => {
  const { lat, lon, radius = 50, limit = 20 } = req.query;

  if (!lat || !lon) {
    return res
      .status(400)
      .json({ error: "lat and lon are required query parameters" });
  }

  if (!Array.isArray(TRUCK_STOPS) || TRUCK_STOPS.length === 0) {
    return res.status(503).json({
      error: "Truck stop dataset not loaded",
      message:
        "Backend is ready, but the nationwide stop list has not been populated yet.",
    });
  }

  const userLat = parseFloat(lat);
  const userLon = parseFloat(lon);
  const maxRadius = parseFloat(radius);
  const maxResults = parseInt(limit, 10);

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

// Root check
app.get("/", (req, res) => {
  res.json({
    status: "BreakPoint30 API is running",
    stopsLoaded: Array.isArray(TRUCK_STOPS) ? TRUCK_STOPS.length : 0,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`BreakPoint30 API running on port ${PORT}`);
});
