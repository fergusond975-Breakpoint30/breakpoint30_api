/**
 * Love's Scraper – Real, API-free, live data
 * BreakPoint30
 */

const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * Fetch and parse a single Love's store page
 */
async function fetchLovesStore(storeId) {
  const url = `https://www.loves.com/en/locations/${storeId}`;

  try {
    const res = await fetch(url, { timeout: 10000 });
    const html = await res.text();
    const $ = cheerio.load(html);

    // Extract station name
    const name = $('h1').first().text().trim();

    // Extract address
    const address = $('.location-address').text().trim();

    // Extract fuel prices (Love’s uses specific CSS classes)
    const prices = {};
    $('.fuel-price').each((i, el) => {
      const type = $(el).find('.fuel-type').text().trim();
      const price = $(el).find('.price').text().trim();
      if (type && price) prices[type] = price;
    });

    return {
      chain: "Love's",
      storeId,
      name,
      address,
      prices,
      url
    };

  } catch (err) {
    return { chain: "Love's", storeId, error: err.message };
  }
}

/**
 * Fetch multiple Love’s stores
 */
async function fetchLovesStores(storeIds) {
  const results = [];
  for (const id of storeIds) {
    const data = await fetchLovesStore(id);
    results.push(data);
  }
  return results;
}

module.exports = {
  fetchLovesStores
};
