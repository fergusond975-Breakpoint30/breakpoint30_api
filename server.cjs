/**
 * BreakPoint30 API Server
 */

const express = require('express');
const cors = require('cors');
const { getLiveChainData } = require('./chains.cjs');

const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.json({ status: "BreakPoint30 API is running" });
});

app.get('/stops', async (req, res) => {
  try {
    const data = await getLiveChainData();
    res.json({
      status: "ok",
      stopsLoaded: data.loves.length + data.pilot.length + data.ta.length,
      data
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
