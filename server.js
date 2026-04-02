const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// ------------------------------------------------------
// Load REAL chain datasets
// ------------------------------------------------------
function loadJSON(filename) {
  try {
    const filePath = path.join(__dirname, "data", filename);
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error loading ${filename}:`, err);
    return [];
  }
}

const loves = loadJSON("loves.json");
const pilotfj = loadJSON("pilotfj.json");
const tapetro = loadJSON("tapetro.json");

// Merge all chain stops
const allStops = [...loves, ...pilotfj, ...tapetro];

console.log(`Loaded ${allStops.length} total truck stops (Love's + Pilot/FJ + TA/Petro)`);

// ------------------------------------------------------
// Routes
// ------------------------------------------------------
app.get("/", (req, res) => {
  res.json({ status: "BreakPoint30 API is running" });
});

app.get("/truckstops", (req, res) => {
  res.json(allStops);
});

// ------------------------------------------------------
// Start server
// ------------------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`BreakPoint30 API running on port ${PORT}`);
});
