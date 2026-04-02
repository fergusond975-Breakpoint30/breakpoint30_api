const express = require("express");
const cors = require("cors");
const { getLiveStops } = require("./liveStops.cjs");

const app = express();
app.use(cors());

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

function distanceMiles(lat1, lon1, lat2, lon2) {
  const R = 3958.8;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

app.get("/truckstops", async (req, res) => {
  const { lat, lon, radius = 50, limit = 20 } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "lat and lon are required" });
  }

  let stops;
  try {
    stops = await getLiveStops();
  } catch (err) {
    console.error("Live stops failed:", err.message);
    return res.status(503).json({
      error: "Unable to load live truck stop data",
      message: "Try again shortly.",
    });
  }

  const userLat = parseFloat(lat);
  const userLon = parseFloat(lon);

  const withDistance = stops.map((stop) => ({
    ...stop,
    distanceMiles: distanceMiles(userLat, userLon, stop.lat, stop.lon),
  }));

  const nearby = withDistance
    .filter((s) => s.distanceMiles <= radius)
    .sort((a, b) => a.distanceMiles - b.distanceMiles)
    .slice(0, limit);

  res.json(nearby);
});

app.get("/", async (req, res) => {
  let count = 0;
  try {
    const stops = await getLiveStops();
    count = stops.length;
  } catch {}

  res.json({
    status: "BreakPoint30 API is running",
    stopsLoaded: count,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`BreakPoint30 API running on port ${PORT}`);
});
