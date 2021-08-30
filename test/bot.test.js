const makeBot = require('../src/bot')

describe('Bot', () => {

  let bot, mockOrderBook
  beforeEach(async () => {
    mockOrderBook = jest.fn()
    bot = makeBot(mockOrderBook)
  })

  it('places orders after start', async () => {
    mockOrderBook.mockImplementation(async () => ({
      bids: [3, 4, 5],
      asks: [1, 2]
    }))

    await bot.start()
    const placedOrders = await bot.getPlacedOrders()
    expect(placedOrders.bids).toHaveLength(5)
    expect(placedOrders.asks).toHaveLength(5)
    // Other test cases and conditions to follow
  });

  it('fills orders after placing them. Fills only asks', async () => {
    mockOrderBook.mockImplementation(async () => ({
      bids: [3, 2, 1],
      asks: [5, 6, 7]
    }))

    await bot.start()
    
    await mockOrderBook.mockImplementation(async () => ({
      bids: [6, 5, 4],
      asks: [8, 9, 10]
    }))
    
    await bot.fillOrders()
    var placedOrders = await bot.getPlacedOrders()

    expect(placedOrders.bids).toHaveLength(5)
    expect(placedOrders.asks).toHaveLength(0)
  })
  
  it('fills orders after placing them. Fills only bids', async () => {
    mockOrderBook.mockImplementation(async () => ({
      bids: [3, 2, 1],
      asks: [5, 6, 7]
    }))

    await bot.start()
    
    await mockOrderBook.mockImplementation(async () => ({
      bids: [0.3, 0.2, 0.1],
      asks: [2, 1, 0.5]
    }))
    
    await bot.fillOrders()
    var placedOrders = await bot.getPlacedOrders()
    
    expect(placedOrders.bids).toHaveLength(0)
    expect(placedOrders.asks).toHaveLength(5)

    console.log(bot.getBalance('USD'))
  });

})