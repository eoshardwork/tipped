const Telegraf = require("telegraf")
const { BOT_TOKEN, BOT_USERNAME } = require('./src/constants/config')['mainnet']

const bot = new Telegraf(BOT_TOKEN)
bot.options.username = BOT_USERNAME

bot.telegram.getChat(process.env.NAME).then(function(chat) {
    // 'chat' is a Chat object
    console.log(chat.id);
});