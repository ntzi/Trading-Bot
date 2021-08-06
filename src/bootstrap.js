const marketApi = require('./marketApi')
const makeBot = require('./bot')

const baseUrl = 'https://api.deversifi.com/bfx/v2/book'
// Can change and add more argments
const api = marketApi(baseUrl, 'tETHUSD', 'P0')
const bot = makeBot(api.getOrderBook)

// Feel free to call other functions
// on the bot or implement other conditions
// from the start
bot.start();