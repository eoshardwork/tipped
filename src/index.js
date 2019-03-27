const { TIP_CONTRACT, BOT_TOKEN, BOT_USERNAME, SERVERLESS, SUPPORT_TELEGRAM_GROUP } = require('./constants')
const { showBalance, getMsgId, getUserId } = require('./utils/utils')
const { disclaimer, introduction, startMessage } = require('./constants/largeText')

// Telegraf
const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const bot = new Telegraf(BOT_TOKEN, { webhookReply: true })
bot.options.username = BOT_USERNAME

// Modules
const { initializeWithdraw } = require('./modules/withdraw')
const { initializeTip } = require('./modules/tip')

initializeWithdraw(bot)
initializeTip(bot)

/**
 * Initial keyboard
 */
bot.command('start', (ctx) => {
    return ctx.reply(
      startMessage(TIP_CONTRACT, getUserId(ctx)), 
      Extra.HTML().markup((markup) =>    
        markup.keyboard([
          ['💰 Balance'],
          ['⬇ Deposit', '⬆ Withdraw'],
          ['⚠️ Disclaimer', '⭐️ Support Telegram', '⚙️ Settings']
        ])
        .resize()
      )
    )
})

/**
 * Commands
 */
bot.command('help', (ctx) => ctx.reply(introduction, Extra.HTML()))
bot.command('deposit', (ctx) => ctx.reply(`Send EOS to *${TIP_CONTRACT}* with your unique telegram ID *${getUserId(ctx)}* as the memo to deposit!`, Extra.markdown().inReplyTo(getMsgId(ctx))))
bot.command('balance', (ctx) => showBalance(ctx))
bot.command('disclaimer', (ctx) => ctx.reply(disclaimer, Extra.HTML()))

/**
 * Listens to text
 */
bot.hears('⬇ Deposit', (ctx) => ctx.reply(`Send EOS to *${TIP_CONTRACT}* with the memo *${getUserId(ctx)}*`, Extra.markdown()))
bot.hears('💰 Balance', (ctx) => showBalance(ctx))
bot.hears('⚠️ Disclaimer', (ctx) => ctx.reply(disclaimer, Extra.HTML()))
bot.hears('⭐️ Support Telegram', (ctx) => ctx.reply(`https://t.me/${SUPPORT_TELEGRAM_GROUP}`))
bot.hears('⚙️ Settings', (ctx) => ctx.reply(`No settings to edit at the moment`, Extra.markdown()))
bot.hears('⬆ Withdraw', (ctx) => ctx.reply('Please enter withdrawal request in this format: /withdraw ACCOUNT AMOUNT SYMBOL (e.g. /withdraw eosio 1.0000 EOS)'))

/**
 * Events:
 *  - Joining new channel
 */
bot.on('new_chat_members', (ctx) => {
    if (ctx['update']['message']['new_chat_member']['username'] === BOT_USERNAME) {
        ctx.reply(introduction, Extra.HTML())
    }
})

/**
 * Launch
 */
if (SERVERLESS) {
    module.exports = bot
} else {
    bot.launch()
}
