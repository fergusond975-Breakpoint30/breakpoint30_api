const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Load Love's data from local JSON file
function fetchLoves() {
  try {
    const filePath = path.join(__dirname, "loves.json");
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    return [{ error: err.message }];
  }
}

app.get("/", (req, res) => {
  res.json({ status: "running" });
});

app.get("/truckstops/loves", (req, res) => {
  const data = fetchLoves();
  res.json(data);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Local Love's server running"));
