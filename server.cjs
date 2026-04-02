const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

// --- Love's GET endpoint (ArcGIS, VERIFIED WORKING) ---
async function fetchLoves() {
  try {
    const url =
      "https://services.arcgis.com/8DAUcrpQcpyLMznu/ArcGIS/rest/services/Loves_Locations/FeatureServer/0/query";

    const response = await axios.get(url, {
      params: {
        where: "1=1",
        outFields: "*",
        f: "json",
      },
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const features = response.data?.features || [];

    const stops = features.map((f) => ({
      brand: "Loves",
      name: f.attributes?.Name || "",
      address: f.attributes?.Address || "",
      city: f.attributes?.City || "",
      state: f.attributes?.State || "",
      lat: f.geometry?.y || null,
      lng: f.geometry?.x || null,
    }));

    return stops;
  } catch (err) {
    return [{ error: err.message }];
  }
}

app.get("/", (req, res) => {
  res.json({ status: "running" });
});

app.get("/truckstops/loves", async (req, res) => {
  const data = await fetchLoves();
  res.json(data);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Love's GET server running"));
