import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

// Temporary: inline "live" stops (no files)
const STOPS = [
  {
    id: "demo-1",
    name: "Demo Truck Stop 1",
    brand: "Independent",
    lat: 39.0,
    lon: -82.0,
    state: "OH"
  },
  {
    id: "demo-2",
    name: "Demo Truck Stop 2",
    brand: "Loves",
    lat: 38.9,
    lon: -81.9,
    state: "OH"
  }
];

app.get("/stops", (req, res) => {
  res.json(STOPS);
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
