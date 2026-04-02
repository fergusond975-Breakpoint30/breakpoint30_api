const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ------------------------------------------------------
// Placeholder datasets (you can replace these later)
// ------------------------------------------------------

const loves = [
  { id: 1, name: "Love's Travel Stop", city: "Sample City", state: "OH" }
];

const pilot = [
  { id: 1, name: "Pilot Travel Center", city: "Sample City", state: "OH" }
];

const ta = [
  { id: 1, name: "TA Travel Center", city: "Sample City", state: "OH" }
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

// ------------------------------------------------------
// Start server
// ------------------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`BreakPoint30 API running on port ${PORT}`);
});
