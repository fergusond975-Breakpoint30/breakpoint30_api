const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "running" });
});

app.get("/truckstops/loves", (req, res) => {
  res.json([
    { test: "A" },
    { test: "B" },
    { test: "C" }
  ]);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("STATIC TEST SERVER RUNNING"));
