const express = require('express');
const tradeRecordController = require('./controllers/trade-record');

const app = express();

const port = process.env.BLOCKLET_PORT || 3030;

app.get('/', (req, res) => {
  res.send('Hello World, Blocklet!');
});

app.get('/api/txs', tradeRecordController.getTradeRecords);

module.exports = app.listen(port, () => {
  console.log(`Blocklet app listening on port ${port}`);
});

