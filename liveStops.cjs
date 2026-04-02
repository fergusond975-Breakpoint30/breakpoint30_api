const fetch = require("node-fetch");

const FIVE_MINUTES = 5 * 60 * 1000;

let cachedStops = [];
let lastFetchTime = 0;

const LOVES_URL = process.env.LOVES_FEED_URL;
const PILOT_URL = process.env.PILOT_FEED_URL;
const TA_URL = process.env.TA_FEED_URL;

async function safeFetchJson(url, label) {
  if (!url) {
    console.warn(`[liveStops] No URL configured for ${label}`);
    return [];
  }

  try {
    const res = await fetch(url, { timeout: 15000 });
    if (!res.ok) {
      console.warn(`[liveStops] ${label} responded with status ${res.status}`);
      return [];
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn(`[liveStops] Failed to fetch ${label}:`, err.message);
    return [];
  }
}

function normalizeLoves(raw) {
  return raw
    .map((s, idx) => ({
      id: `loves-${s.id || idx}`,
      brand: "Loves",
      name: s.name || "Love's Travel Stop",
      city: s.city || "",
      state: s.state || "",
      lat: Number(s.lat || s.latitude),
      lon: Number(s.lon || s.longitude),
    }))
    .filter((s) => Number.isFinite(s.lat) && Number.isFinite(s.lon));
}

function normalizePilot(raw) {
  return raw
    .map((s, idx) => ({
      id: `pilot-${s.id || idx}`,
      brand: s.brand || "Pilot",
      name: s.name || "Pilot / Flying J",
      city: s.city || "",
      state: s.state || "",
      lat: Number(s.lat || s.latitude),
      lon: Number(s.lon || s.longitude),
    }))
    .filter((s) => Number.isFinite(s.lat) && Number.isFinite(s.lon));
}

function normalizeTa(raw) {
  return raw
    .map((s, idx) => ({
      id: `ta-${s.id || idx}`,
      brand: s.brand || "TA",
      name: s.name || "TA / Petro",
      city: s.city || "",
      state: s.state || "",
      lat: Number(s.lat || s.latitude),
      lon: Number(s.lon || s.longitude),
    }))
    .filter((s) => Number.isFinite(s.lat) && Number.isFinite(s.lon));
}

async function refreshStopsIfNeeded() {
  const now = Date.now();
  if (now - lastFetchTime < FIVE_MINUTES && cachedStops.length > 0) {
    return cachedStops;
  }

  console.log("[liveStops] Refreshing live chain data…");

  const [lovesRaw, pilotRaw, taRaw] = await Promise.all([
    safeFetchJson(LOVES_URL, "Love's"),
    safeFetchJson(PILOT_URL, "Pilot/Flying J"),
    safeFetchJson(TA_URL, "TA/Petro"),
  ]);

  const loves = normalizeLoves(lovesRaw);
  const pilot = normalizePilot(pilotRaw);
  const ta = normalizeTa(taRaw);

  const merged = [...loves, ...pilot, ...ta];

  if (merged.length === 0) {
    console.warn("[liveStops] All chains failed; keeping previous cache.");
    return cachedStops;
  }

  cachedStops = merged;
  lastFetchTime = now;

  console.log(
    `[liveStops] Loaded ${merged.length} live stops (Love's: ${loves.length}, Pilot/FJ: ${pilot.length}, TA/Petro: ${ta.length})`
  );

  return cachedStops;
}

async function getLiveStops() {
  return refreshStopsIfNeeded();
}

module.exports = { getLiveStops };
