/**
 * @typedef Order
 * @property {Number} price
 * @property {Number} quantity
 */

/**
 * 
 * @param {function} getOrderBook fetches the order book split by bids and asks
 */
module.exports = (getOrderBook) => {
  /**
   * Start the bot and place initial orders
   * Watch for changes and fill on interval
   */
  async function start() {
    throw new Error('Not implemented')
  }

  /**
   * Should return a orders matching
   * @returns {Order[]} list of all placed orders (bids and asks) no ordering required
   */
  async function getPlacedOrders() {
    throw new Error('Not implemented')
  }

  /**
   * Should return available balance of the symbol
   * Total balance - placed orders
   * @param {String} symbol, e.g. USD or ETH
   */
  async function getBalance(symbol) {
    throw new Error('Not implemented')
  }

  /**
   * trigger filling of orders which are in range
   * e.g. asks bellow bestAsk and bids above bestBid should be filled
   */
  async function fillOrders(symbol) {
    throw new Error('Not implemented')
  }

  return {
    start,
    getPlacedOrders,
    getBalance,
    fillOrders
  }
}