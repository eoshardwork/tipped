// Eosjs
const { tip } = require('../utils/eos')
const { TOKEN_CONTRACT, TOKEN_PRECISION, MINIMUM_TIP, MAXIMUM_TIP, BLOKS_URL, BOT_USERNAME, TOKEN_SYMBOL, SUPPORT_TELEGRAM_GROUP } = require('../constants')
const { getMsgId } = require('../utils/utils')
const { tipFormat } = require('../constants/largeText')

// Telegraf
const Extra = require('telegraf/extra')

/**
 * Tip
 */
function handleTip (ctx) {
    // Check existence of message
    const tipper_message = ctx['update']['message']
    if (!tipper_message) 
        return ctx.reply(tipFormat, Extra.HTML().inReplyTo(getMsgId(ctx)))

    // Get ID and message of tipper
    const { 
        from: { id: tipper_id, username: from_username }, 
        text: tipper_text, 
        reply_to_message 
    } = tipper_message
    if (!reply_to_message) 
        return ctx.reply('Please reply to a user to tip them.')

    // Get ID of user tipped
    let { id: tipped_id, username: to_username } = reply_to_message['from']
    if (!tipped_id) 
        return ctx.reply('Please reply to a user to tip them.', Extra.inReplyTo(getMsgId(ctx)))

    // Split TIP MESSAGE into amount, symbol and memo
    let splitTip = tipper_text.split(' ')
    if (splitTip.length < 3) 
        return ctx.reply(tipFormat, Extra.HTML().inReplyTo(getMsgId(ctx)))

    let [, amount, symbol] = splitTip
    const memo = splitTip.length > 3
        ? splitTip.slice(3).join(' ')
        : ''

    // Ensure not sending to bot
    if (to_username === BOT_USERNAME) 
        return ctx.reply(`Cannot tip the bot, join ${SUPPORT_TELEGRAM_GROUP} to give us your 2 cents!`, Extra.markdown().inReplyTo(getMsgId(ctx)))
    to_username = to_username ? ` ${to_username} ` : ' '

    // Validate sender is different from receiver
    if (tipper_id === tipped_id) 
        return ctx.reply('Cannot tip yourself!', Extra.markdown().inReplyTo(getMsgId(ctx)))

    // Validate symbol
    if (!symbol || typeof symbol !== 'string') 
        return ctx.reply(tipFormat, Extra.HTML().inReplyTo(getMsgId(ctx)))
    symbol = symbol.toUpperCase()
    if (symbol !== TOKEN_SYMBOL) 
        return ctx.reply(tipFormat, Extra.HTML().inReplyTo(getMsgId(ctx)))

    // Validate Quantity
    let quantity = Number(amount)
    if (!quantity || quantity < MINIMUM_TIP) 
        return ctx.reply(`Must tip atleast ${MINIMUM_TIP} ${symbol}!`, Extra.markdown().inReplyTo(getMsgId(ctx)))
    if (quantity > MAXIMUM_TIP) 
        return ctx.reply(`The max tip is ${MAXIMUM_TIP.toFixed(TOKEN_PRECISION)} ${symbol}!`, Extra.markdown().inReplyTo(getMsgId(ctx)))

    // Find contract (TODO remove hardcode)
    const finalQuantity = `${quantity.toFixed(TOKEN_PRECISION)} ${symbol}`;

    // Send transfer
    (async () => {
        try {
            const result = await tip (TOKEN_CONTRACT, tipper_id, tipped_id, from_username, to_username, finalQuantity, memo)

            const bloksLink = `<a href="${BLOKS_URL}/transaction/${result['transaction_id']}">(TX)</a>`
            const replyMessage = `Successfully tipped${to_username}${finalQuantity}! ${bloksLink}`
            
            ctx.reply(replyMessage, Extra.HTML().inReplyTo(getMsgId(ctx)).webPreview(false))
        } catch (e) {
            console.log(e)
            ctx.reply('Could not tip due to ' + e, Extra.markdown().inReplyTo(getMsgId(ctx)))
        }
    })();
}

module.exports.initializeTip = function (bot) {
    bot.hears(/^\/tip/, (ctx) => {
        try {
            handleTip(ctx)
        } catch (e) {
            console.log(e)
        }
    })
}