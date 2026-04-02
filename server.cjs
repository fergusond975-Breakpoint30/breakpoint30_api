async function fetchLoves() {
  try {
    const url = "https://www.loves.com/en/locations";

    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const html = response.data;
    const cheerio = require("cheerio");
    const $ = cheerio.load(html);

    const stops = [];

    $(".location-result").each((i, el) => {
      const name = $(el).find(".location-result__title").text().trim();
      const address = $(el).find(".location-result__address").text().trim();
      const city = $(el).find(".location-result__city").text().trim();
      const state = $(el).find(".location-result__state").text().trim();
      const lat = $(el).attr("data-lat");
      const lng = $(el).attr("data-lng");

      stops.push({
        brand: "Loves",
        name,
        address,
        city,
        state,
        lat: lat ? Number(lat) : null,
        lng: lng ? Number(lng) : null,
      });
    });

    return safeArray(stops);
  } catch (err) {
    console.error("Loves scraper failed:", err.message);
    return [];
  }
}
