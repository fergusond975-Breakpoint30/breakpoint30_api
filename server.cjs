const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());

// Root route
app.get("/", (req, res) => {
  res.json({ status: "BreakPoint30 API is running" });
});

// ------------------------------
// TRUCK STOPS ROUTE
// ------------------------------
app.get("/truckstops", async (req, res) => {
  try {
    let allStops = [];

    // ----------------------------------------------------
    // 1. LOVE'S TRUCK STOPS
    // ----------------------------------------------------
    const lovesUrl = "https://www.loves.com/api/locations";
    const lovesResponse = await axios.get(lovesUrl);
    const lovesData = lovesResponse.data;

    const lovesStops = lovesData.map((stop) => ({
      id: `loves-${stop.locationId}`,
      brand: "Loves",
      name: stop.name || "",
      latitude: stop.latitude || null,
      longitude: stop.longitude || null,
      address: {
        street: stop.address?.address1 || "",
        suite: stop.address?.address2 || "",
        city: stop.address?.city || "",
        zipcode: stop.address?.postalCode || "",
      },
      city: stop.address?.city || "",
      state: stop.address?.state || "",
      postalCode: stop.address?.postalCode || "",
      country: "US",
      raw: stop
    }));

    allStops = allStops.concat(lovesStops);

    // ----------------------------------------------------
    // 2. PILOT / FLYING J
    // ----------------------------------------------------
    const pilotUrl = "https://www.pilotflyingj.com/api/locations";
    const pilotResponse = await axios.get(pilotUrl);
    const pilotData = pilotResponse.data.locations || [];

    const pilotStops = pilotData.map((stop) => ({
      id: `pilot-${stop.id}`,
      brand: "Pilot/Flying J",
      name: stop.name || "",
      latitude: stop.latitude || null,
      longitude: stop.longitude || null,
      address: {
        street: stop.address1 || "",
        suite: stop.address2 || "",
        city: stop.city || "",
        zipcode: stop.postalCode || "",
      },
      city: stop.city || "",
      state: stop.state || "",
      postalCode: stop.postalCode || "",
      country: "US",
      raw: stop
    }));

    allStops = allStops.concat(pilotStops);

    // ----------------------------------------------------
    // 3. TA / PETRO
    // ----------------------------------------------------
    const taUrl = "https://www.ta-petro.com/api/locations";
    const taResponse = await axios.get(taUrl);
    const taData = taResponse.data || [];

    const taStops = taData.map((stop) => ({
      id: `ta-${stop.locationId}`,
      brand: stop.brand || "TA/Petro",
      name: stop.name || "",
      latitude: stop.latitude || null,
      longitude: stop.longitude || null,
      address: {
        street: stop.address1 || "",
        suite: stop.address2 || "",
        city: stop.city || "",
        zipcode: stop.zip || "",
      },
      city: stop.city || "",
      state: stop.state || "",
      postalCode: stop.zip || "",
      country: "US",
      raw: stop
    }));

    allStops = allStops.concat(taStops);

    // ----------------------------------------------------
    // SEND COMBINED DATA
    // ----------------------------------------------------
    res.json(allStops);

  } catch (error) {
    console.error("Truckstop error:", error);
    res.status(500).json({ error: "Failed to load truck stop data" });
  }
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`BreakPoint30 API listening on port ${PORT}`);
});
