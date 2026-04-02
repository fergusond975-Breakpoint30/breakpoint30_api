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
const independents = loadJSON("independents.json");
const restareas = loadJSON("restareas.json");
const nationwide = loadJSON("nationwide.json");

const allStops = [
  ...loves,
  ...pilotfj,
  ...tapetro,
  ...independents,
  ...restareas,
  ...nationwide
];

console.log(`Loaded ${allStops.length} total truck stops`);

// ------------------------------------------------------
// Routes
// ------------------------------------------------------
app.get("/", (req, res) => {
  res.json({ status: "BreakPoint30 API is running" });
});

app.get("/truckstops", (req, res) => {
  res.json(allStops);
});

app.get("/loves", (req, res) => res.json(loves));
app.get("/pilot", (req, res) => res.json(pilotfj));
app.get("/ta", (req, res) => res.json(tapetro));
app.get("/independents", (req, res) => res.json(independents));
app.get("/restareas", (req, res) => res.json(restareas));
app.get("/nationwide", (req, res) => res.json(nationwide));

// ------------------------------------------------------
// Start server
// ------------------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`BreakPoint30 API running on port ${PORT}`);
});
