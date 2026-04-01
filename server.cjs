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
    // 1. LOVE'S (REAL-TIME)
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
    }));

    allStops = allStops.concat(lovesStops);

    // ----------------------------------------------------
    // 2. PILOT / FLYING J (REAL-TIME)
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
    }));

    allStops = allStops.concat(pilotStops);

    // ----------------------------------------------------
    // 3. TA / PETRO / TA EXPRESS / PETRO STOPPING CENTERS (STATIC)
    // ----------------------------------------------------
    const taStatic = [
      {
        id: "ta-1",
        brand: "TA",
        name: "TA Travel Center",
        latitude: 39.123,
        longitude: -82.123,
        city: "Circleville",
        state: "OH",
        postalCode: "43113",
        address: {
          street: "123 TA Road",
          suite: "",
          city: "Circleville",
          zipcode: "43113"
        }
      },
      {
        id: "petro-1",
        brand: "Petro",
        name: "Petro Stopping Center",
        latitude: 40.123,
        longitude: -83.123,
        city: "London",
        state: "OH",
        postalCode: "43140",
        address: {
          street: "500 Petro Blvd",
          suite: "",
          city: "London",
          zipcode: "43140"
        }
      },
      {
        id: "taexpress-1",
        brand: "TA Express",
        name: "TA Express",
        latitude: 38.123,
        longitude: -81.123,
        city: "Ripley",
        state: "WV",
        postalCode: "25271",
        address: {
          street: "77 Express Lane",
          suite: "",
          city: "Ripley",
          zipcode: "25271"
        }
      }
    ];

    allStops = allStops.concat(taStatic);

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
