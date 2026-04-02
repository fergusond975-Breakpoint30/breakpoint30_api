/**
 * chains.cjs
 * BreakPoint30 – Real Chain Integration Framework
 * Structure only – scraping logic added next
 */

module.exports = {
  chains: {
    loves: {
      name: "Love's",
      enabled: true,
      fetchMethod: "scrape",
      urlPattern: "https://www.loves.com/en/locations/{storeId}",
      parser: "parseLoves",
    },

    pilot: {
      name: "Pilot / Flying J",
      enabled: true,
      fetchMethod: "scrape",
      urlPattern: "https://www.pilotflyingj.com/locations/{storeId}",
      parser: "parsePilot",
    },

    ta: {
      name: "TA / Petro",
      enabled: true,
      fetchMethod: "scrape",
      urlPattern: "https://www.ta-petro.com/location/{storeId}",
      parser: "parseTA",
    },
  },

  /**
   * Placeholder functions – real scraping logic added next.
   * These return empty arrays so your server stays stable.
   */

  async getLiveChainData() {
    return {
      loves: [],
      pilot: [],
      ta: [],
    };
  },

  // Parsers will be added in the next step
  parseLoves(html) { return []; },
  parsePilot(html) { return []; },
  parseTA(html) { return []; },
};
