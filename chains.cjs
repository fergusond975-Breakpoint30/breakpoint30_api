/**
 * chains.cjs
 * BreakPoint30 – Real Chain Integration Framework
 * Love's scraper integrated
 */

const { fetchLovesStores } = require('./lovesScraper.cjs');

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
   * Pilot/FJ and TA/Petro will be added next
   */
  async getLiveChainData() {
    const lovesData = await fetchLovesStores([1, 2, 3]); // sample store IDs for now
    return {
      loves: lovesData,
      pilot: [],
      ta: [],
    };
  },
};
