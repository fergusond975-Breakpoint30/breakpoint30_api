/**
 * chains.cjs
 * BreakPoint30 – Real Chain Integration Framework
 * Safe for Render deployment (no top-level scraper imports)
 */

let fetchLovesStores = null;

module.exports = {
  chains: {
    loves: {
      name: "Love's",
      enabled: true,
      fetchMethod: "scrape",
      parser: "loves",
    },

    pilot: {
      name: "Pilot / Flying J",
      enabled: false,
      fetchMethod: "scrape",
      parser: "pilot",
    },

    ta: {
      name: "TA / Petro",
      enabled: false,
      fetchMethod: "scrape",
      parser: "ta",
    },
  },

  /**
   * Real Love's integration
   * Pilot/FJ and TA/Petro added later
   */
  async getLiveChainData() {
    // Lazy-load scraper ONLY when endpoint is called
    if (!fetchLovesStores) {
      fetchLovesStores = require('./lovesScraper.cjs').fetchLovesStores;
    }

    // Temporary sample IDs until real integration
    const lovesData = await fetchLovesStores([1, 2, 3]);

    return {
      loves: lovesData,
      pilot: [],
      ta: [],
    };
  },
};
