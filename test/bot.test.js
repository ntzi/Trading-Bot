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
    expect(placedOrders).toHaveLength(10)
    // Other test cases and conditions to follow
  });

})