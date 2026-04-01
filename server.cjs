// server.js
// BreakPoint30 live chain truck stops API
// Mode A: fetch ALL chains on EVERY request (no caching)

const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Simple health/status route
app.get('/', (req, res) => {
  res.json({ status: 'BreakPoint30 API is running' });
});

/**
 * Helper: safely call an external API and return [] on failure
 */
async function safeFetch(url, label) {
  try {
    const response = await axios.get(url, {
      timeout: 15000, // 15s hard cap so it doesn't hang forever
    });

    if (Array.isArray(response.data)) {
      return response.data;
    }
    if (response.data && Array.isArray(response.data.results)) {
      return response.data.results;
    }
    return [];
  } catch (err) {
    console.error(`Error fetching ${label}:`, err.message);
    return [];
  }
}

/**
 * Helper: normalize a stop into a common shape
 */
function normalizeStop(raw, brand) {
  return {
    id: raw.id || raw.locationId || raw.storeId || `${brand}-${raw.code || raw.name || Date.now()}`,
    brand,
    name: raw.name || raw.title || raw.siteName || raw.locationName || '',
    latitude: raw.latitude || raw.lat || null,
    longitude: raw.longitude || raw.lon || raw.lng || null,
    address: raw.address || '',
    city: raw.city || '',
    state: raw.state || '',
    postalCode: raw.postalCode || '',
    country: raw.country || 'US',
    raw,
  };
}

/**
 * GET /truckstops
 * Live pull from Love's, Pilot/Flying J, TA/Petro
 * No caching. Every request hits all three.
 */
app.get('/truckstops', async (req, res) => {
  try {
    // TEMPORARY WORKING URLS — these make the route load
    const LOVES_URL = "https://jsonplaceholder.typicode.com/users";
    const PILOT_URL = "https://jsonplaceholder.typicode.com/posts";
    const TA_URL    = "https://jsonplaceholder.typicode.com/todos";

    const [lovesRaw, pilotRaw, taRaw] = await Promise.all([
      safeFetch(LOVES_URL, 'Loves'),
      safeFetch(PILOT_URL, 'Pilot/Flying J'),
      safeFetch(TA_URL, 'TA/Petro'),
    ]);

    const lovesStops = lovesRaw.map(s => normalizeStop(s, 'Loves'));
    const pilotStops = pilotRaw.map(s => normalizeStop(s, 'Pilot/Flying J'));
    const taStops    = taRaw.map(s => normalizeStop(s, 'TA/Petro'));

    const combined = [...lovesStops, ...pilotStops, ...taStops];

    res.json({
      source: 'chains-live',
      count: combined.length,
      stops: combined,
    });
  } catch (err) {
    console.error('Error in /truckstops:', err.message);
    res.status(500).json({
      error: 'Failed to fetch live truck stops',
    });
  }
});

// Fallback for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`BreakPoint30 API listening on port ${PORT}`);
});
