const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

// --- Test Love's API with known-good coordinates ---
async function fetchLoves() {
  try {
    const response = await axios.post(
      "https://www.loves.com/api/locations/search",
      {
        page: 1,
        pageSize: 50,
        latitude: 35.4676,     // Oklahoma City
        longitude: -97.5164,
        radiusMiles: 300,
        filters: {}
      },
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Content-Type": "application/json"
        }
      }
    );

    return response.data?.results || [];
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
app.listen(PORT, () => console.log("Love's test server running"));
