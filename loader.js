const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ------------------------------------------------------
// Placeholder datasets (replace later when ready)
// ------------------------------------------------------

const loves = [
  { id: "loves-1", name: "Love's Travel Stop", brand: "Loves", city: "Sample City", state: "OH", lat: 39.0, lon: -82.0 }
];

const pilot = [
  { id: "pilot-1", name: "Pilot Travel Center", brand: "Pilot", city: "Sample City", state: "OH", lat: 38.9, lon: -81.9 }
];

const ta = [
  { id: "ta-1", name: "TA Travel Center", brand: "TA", city: "Sample City", state: "OH", lat: 39.1, lon: -82.1 }
];

// Combine all stops into one nationwide list
const allStops = [...loves, ...pilot, ...ta];

// ------------------------------------------------------
// Routes
// ------------------------------------------------------

// Health check
app.get("/", (req, res) => {
  res.json({ status: "BreakPoint30 API is running" });
});

// Return ALL truck stops nationwide
app.get("/truckstops", (req, res) => {
  res.json(allStops);
});

// Chain-specific endpoints
app.get("/loves", (req, res) => {
  res.json(loves);
});

app.get("/pilot", (req, res) => {
  res.json(pilot);
});

app.get("/ta", (req, res) => {
  res.json(ta);
});

// Keep your existing /stops endpoint so nothing breaks
app.get("/stops", (req, res) => {
  res.json(allStops);
});

// ------------------------------------------------------
// Start server
// ------------------------------------------------------
app.listen(PORT, () => {
  console.log(`BreakPoint30 API running on port ${PORT}`);
});
