import express from "express";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import { loadAllStops } from "./loader.js";

const app = express();

app.use(cors());
app.use(compression());
app.use(express.json());
app.use(morgan("dev"));

// Route: all stops
app.get("/stops", (req, res) => {
  const stops = loadAllStops();
  res.json(stops);
});

// Root
app.get("/", (req, res) => {
  res.json({ status: "BreakPoint30 API is running" });
});

// Health
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`BreakPoint30 API running on port ${PORT}`);
});
