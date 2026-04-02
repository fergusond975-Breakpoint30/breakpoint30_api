async function fetchLoves() {
  try {
    const url = "https://www.loves.com/en/locations";

    const response = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const html = response.data;

    // Love's now embeds JSON inside a script tag
    const jsonMatch = html.match(/window\.__INITIAL_STATE__ = ({.*});/);

    if (!jsonMatch) {
      console.error("Could not find embedded Love's JSON");
      return [];
    }

    const json = JSON.parse(jsonMatch[1]);

    const locations = json?.locations?.locationResults || [];

    const stops = locations.map((loc) => ({
      brand: "Loves",
      name: loc.name || "",
      address: loc.address1 || "",
      city: loc.city || "",
      state: loc.state || "",
      lat: loc.latitude || null,
      lng: loc.longitude || null,
    }));

    return safeArray(stops);
  } catch (err) {
    console.error("Love's scraper failed:", err.message);
    return [];
  }
}
