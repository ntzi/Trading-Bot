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
  var balance = [
    {
      symbol: 'USD',
      amount: 2000
    },
    {
      symbol: 'ETH',
      amount: 10
    }
  ]
  var orders = {
    bids: [],
    asks: []
  }
  
  /**
   * Start the bot and place initial orders
   * Watch for changes and fill on interval
   */
  async function start() {
    await fillOrders()
    await placeOrders()

    setInterval(async () => {
      await fillOrders()
      await placeOrders()
    }, 5000);

    setInterval(async () => {
      logBalance()
    }, 30000);
  }

  /**
   * Should return a orders matching
   * @returns {Order[]} list of all placed orders (bids and asks) no ordering required
   */
  async function getPlacedOrders() {
    return orders
  }

  /**
   * Should create bid and ask orders with random price within 5% of the best bid and ask prices.
   * Should each order have random amounts.
   * Should the total number of bid orders be 5.
   * Should the total number of ask orders be 5.
   */
  async function placeOrders() {
    let numberOfBidOrdersToPlace = 5 - orders.bids.length
    let numberOfAskOrdersToPlace = 5 - orders.asks.length
    let totalAskAmount = 0
    let totalBidAmount = 0
    
    if ((numberOfBidOrdersToPlace > 5) || (numberOfAskOrdersToPlace > 5)) return

    await Promise.all(Array(numberOfAskOrdersToPlace).fill(0).map(async (i) => {
      let askPrice = await getRandomAsk()
      let percentageOfTotalAmount = (1 / numberOfAskOrdersToPlace) * 100
      let askAmount = await getRandomAmount('ETH', percentageOfTotalAmount)
      askAmount = Math.round(askAmount * 10000) / 10000
      totalAskAmount += askAmount

      if (askAmount > 0) {
        orders.asks.push([askPrice, askAmount])
        console.log(`PLACE ASK @ ${askPrice} ${askAmount}`)
      }
    }))

    objIndex = balance.findIndex((obj => obj.symbol === 'ETH'));
    balance[objIndex].amount -= totalAskAmount

    await Promise.all(Array(numberOfBidOrdersToPlace).fill(0).map(async (i) => {
      let bidPrice = await getRandomBid()
      let percentageOfTotalAmount = (1 / numberOfBidOrdersToPlace) * 100
      let bidAmount = await getRandomAmount('USD', percentageOfTotalAmount)
      bidAmount = Math.round(bidAmount * 100) / 100
      totalBidAmount += bidAmount

      if (bidAmount > 0) {
        orders.bids.push([bidPrice, bidAmount])
        console.log(`PLACE BID @ ${bidPrice} ${bidAmount}`)
      }
    }))

    objIndex = balance.findIndex((obj => obj.symbol === 'USD'));
    balance[objIndex].amount -= totalBidAmount
  }

  /**
   * Should return a random bid price within 5% of the best bid prices.
   * @returns {Number} random bid price within 5% of the best bid prices
   */
  async function getRandomBid() {
    let orderBook = await getOrderBook()
    let maxBid = orderBook.bids[0]
    let minBid = orderBook.bids[orderBook.bids.length - 1]
    let minMaxBid = maxBid - minBid
    // The minimum bid price in the 5% range of the best bid prices
    let bidMinLimit = maxBid - (minMaxBid * 0.05)
    let randomBid = Math.random() * (maxBid - bidMinLimit) + bidMinLimit
    randomBid = Math.round(randomBid * 100) / 100

    return randomBid
  }

  /**
   * Should return a random ask price within 5% of the best ask prices.
   * @returns {Number} random ask price within 5% of the best ask prices
   */
  async function getRandomAsk() {
    let orderBook = await getOrderBook()
    let minAsk = orderBook.asks[0]
    let maxAsk = orderBook.asks[orderBook.asks.length - 1]
    let minMaxAsk = maxAsk - minAsk
    // The maximum ask price in the 5% range of the best ask prices
    let askMaxLimit = minAsk + (minMaxAsk * 0.05)
    let randomAsk = Math.random() * (askMaxLimit - minAsk) + minAsk
    randomAsk = Math.round(randomAsk * 10) / 10

    return randomAsk
  }

  /**
   * Should return a random amount within a range with max value a percentage ("percentageOfTotalAmount") of the 
   * symbol's ("symbol") balance
   * @param {String} symbol e.g. USD or ETH
   * @param {Number} percentageOfTotalAmount e.g. 20
   */
  async function getRandomAmount(symbol, percentageOfTotalAmount) {
    let numberOfDecimals = 5
    if (symbol === 'ETH') numberOfDecimals = 5

    let maxAmount = balance.filter(item => item.symbol === symbol).map(item => item.amount)[0]
    maxAmount = maxAmount * percentageOfTotalAmount / 100
    maxAmount = Math.round(maxAmount * Math.pow(10, numberOfDecimals)) / Math.pow(10, numberOfDecimals)
    amount = Math.random() * maxAmount

    return amount
  }


  /**
   * Should return available balance of the symbol
   * Total balance - placed orders
   * @param {String} symbol, e.g. USD or ETH
   */
  async function getBalance(symbol) {
    let amount = balance.filter(item => item.symbol === symbol.toUpperCase()).map(item => item.amount)[0]
    return amount
  }

  /**
   * Should log balances of all symbols
  */
  async function logBalance() {
    let usdBalance = await getBalance('USD')
    let ethBalance = await getBalance('ETH')
    console.log(`Balance: \n USD: ${usdBalance}\n ETH: ${ethBalance}`)
  }

  /**
   * trigger filling of orders which are in range
   * e.g. asks bellow bestAsk and bids above bestBid should be filled
   */
  // TODO: Should be symbol independent. Should work for any pair of symbols, not only ETH/USD
  async function fillOrders() {
    let orderBook = await getOrderBook()
    let bestAsk = orderBook.asks[0]
    let filledBids = orders.bids.filter(bid => bid[0] >= bestAsk)
    let unfilledBids = orders.bids.filter(bid => bid[0] < bestAsk)
    orders.bids = unfilledBids
    filledBids.forEach(bid => {
      usdAmount = bid[1]
      usdPrice = bid[0]
      ethAmount = Math.round((usdAmount / usdPrice) * 10000) / 10000
      console.log(`FILLED BID @ ${usdPrice} ${usdAmount} (ETH: +${ethAmount} USD: -${usdAmount})`)
    })

    let bestBid = orderBook.asks[0]
    let filledAsks = orders.asks.filter(ask => ask[0] <= bestBid)
    let unfilledAsks = orders.asks.filter(ask => ask[0] > bestBid)
    orders.asks = unfilledAsks
    filledAsks.forEach(ask => {
      usdAmount = ask[1]
      usdPrice = ask[0]
      ethAmount = Math.round((usdAmount / usdPrice) * 10000) / 10000
      console.log(`FILLED ASK @ ${usdPrice} ${usdAmount} (ETH: -${ethAmount} USD: +${usdAmount})`)
    })
  }

  return {
    start,
    getPlacedOrders,
    getBalance,
    fillOrders
  }
}