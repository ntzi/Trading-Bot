const https = require('https');
const http = require('http');

async function get(url) {
  return new Promise((resolve, reject) => {
    getProtocol(url)
      .get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', (err) => reject(err));
  })
}

function getProtocol(url) {
  return url.startsWith('https')
    ? https
    : http
}

/**
 * @typedef {Object} OrderBook
 * @property {Number[]} bids
 * @property {Number[]} asks
 */

/**
 * Creates a market api fetcher for a single symbol:percision
 * @param {String} baseUrl 
 * @param {String} symbol 
 * @param {String} percision 25 or 250
 */
module.exports = (baseUrl, symbol, percision) => {
  const uri = `${baseUrl}/${symbol}/${percision}`

  /**
   * Fetches orders and splits into bids and asks
   * @returns {OrderBook}
   */
  const getOrderBook = async () => {
    const prices = await get(uri);

    // this has been written as an example, feel free
    // to change and return in a different format
    return prices.reduce((orders, [price, count, amount]) => {
      const target = amount > 0 ? orders.bids : orders.asks
      // target.push(count)
      target.push(price)
      return orders
    }, { bids: [], asks: [] })
  }

  return {
    getOrderBook
  }
}
