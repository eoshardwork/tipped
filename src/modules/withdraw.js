const { withdraw } = require('../utils/eos')
const { CHAIN, TOKEN_CONTRACT, TOKEN_SYMBOL, TOKEN_PRECISION, MINIMUM_TIP, BLOKS_URL, MAXIMUM_MONTHLY_WITHDRAW} = require('../constants')
const Extra = require('telegraf/extra')
const { getMsgId, callbackFromMatchesRepliedMessage } = require('../utils/utils')
const { withdrawFormat } = require('../constants/largeText')
const redis = require('../utils/redis')

/** 
 * Withdrawal
 */
function handleWithdrawRequest (ctx) {
    const { text } = ctx['update']['message']
    if (!text) return ctx.reply('No message')

    let splitWithdraw = text.split(' ')
    if (splitWithdraw.length < 4) {
        return ctx.reply(withdrawFormat, Extra.HTML().inReplyTo(getMsgId(ctx)))
    }
    let [, account, amount, symbol] = splitWithdraw

    // Validation
    const validName = account && /(^[a-zA-Z12345.]+$)/.test(account)
    if (!validName) return ctx.reply('Invalid name, make sure it is a valid EOS account.', Extra.markdown().inReplyTo(getMsgId(ctx)))
    if (!symbol || typeof symbol !== 'string') return ctx.reply('Invalid symbol', Extra.markdown().inReplyTo(getMsgId(ctx)))
    symbol = symbol.toUpperCase()
    if (!amount || amount < MINIMUM_TIP) return ctx.reply(`Must withdraw atleast ${MINIMUM_TIP} ${symbol}!`, Extra.markdown().inReplyTo(getMsgId(ctx)))

    // Redis validation

    ctx.reply(
        `<b>Are you sure you wish to withdraw ${amount} ${symbol} (${TOKEN_CONTRACT}) to ${account}</b>?`,
        Extra.HTML().inReplyTo(getMsgId(ctx)).markup((markup) =>    
            markup.inlineKeyboard([
                markup.callbackButton('✅ Yes', '✅ Yes'),
                markup.callbackButton('❌ No', '❌ No')
            ])
            .oneTime()
            .resize()
        )
    );
}

async function handleWithdrawConfirm (ctx) {
  if (!callbackFromMatchesRepliedMessage(ctx)) return

  // Get ID and message of tipper
  const originalMessage = ctx['update']['callback_query']['message']['reply_to_message']
  const { id: from_id, username: from_username } = originalMessage['from']
  
  // console.dir(ctx, { depth: null })
  const text = originalMessage['text']
  let splitWithdraw = text.split(' ')

  let [, withdraw_to, amount, symbol] = splitWithdraw
  symbol = symbol.toUpperCase()
  amount = Number(amount)
  const memo = splitWithdraw.length > 4
      ? splitWithdraw.slice(4).join(' ')
      : ''

  const quantity = `${amount.toFixed(TOKEN_PRECISION)} ${symbol}`;

  // Redis
  const redisKey = `${CHAIN}-${TOKEN_CONTRACT}-${TOKEN_SYMBOL}-${from_id}-${new Date().getMonth()}`
  const existingWithdrawAmount = await redis.get(redisKey) || 0

  const withdrawLimitLeft = MAXIMUM_MONTHLY_WITHDRAW - existingWithdrawAmount
  if (amount > withdrawLimitLeft) {
    ctx.editMessageText(
        `You can only withdraw a maximum of <b>${MAXIMUM_MONTHLY_WITHDRAW.toFixed(TOKEN_PRECISION)} ${TOKEN_SYMBOL}</b> every month. Can withdraw <b>${withdrawLimitLeft.toFixed(TOKEN_PRECISION)} ${TOKEN_SYMBOL}</b> more this month.`,
        Extra.HTML().markup((markup) => markup.inlineKeyboard([]))
    )

    return ctx.answerCbQuery()
  }

  try {
    const result = await withdraw(TOKEN_CONTRACT, from_id, from_username, withdraw_to, quantity, memo)
    const bloksLink = `<a href="${BLOKS_URL}/transaction/${result['transaction_id']}">(TX)</a>`
    const replyMessage = `Successfully withdrew <b>${quantity}</b> from Telegram account<b>${from_username ? ` ${from_username} ` : ' '}</b>to EOS account <b>${withdraw_to}</b> ${bloksLink}`
    
    // Update Redis
    await redis.incrbyfloat(redisKey, amount)

    ctx.editMessageText(
        replyMessage,
        Extra.HTML().markup((markup) => markup.inlineKeyboard([])).webPreview(false)
    )
  } catch (e) {
      console.log(e)
      ctx.editMessageText(
          'Could not withdraw due to ' + e,
          Extra.HTML().markup((markup) => markup.inlineKeyboard([]))
      )
  }

  ctx.answerCbQuery()
}

async function handleWithdrawCancel (ctx) {
    // console.dir(ctx, { depth: null })
    const match = callbackFromMatchesRepliedMessage(ctx)
    if (!match) return

    ctx.answerCbQuery()
    return ctx.editMessageText(
        'Withdraw request cancelled.',
        Extra.markdown().markup((markup) => markup.inlineKeyboard([]))
    )
}

module.exports.initializeWithdraw = function (bot) {
    bot.hears(/^\/withdraw/, (ctx) => {
        try {
            handleWithdrawRequest(ctx)
        } catch (e) {
            console.log(e)
        }
    })

    bot.action('✅ Yes', async (ctx) => {
        try {
            handleWithdrawConfirm(ctx)
        } catch (e) {
            console.log(e)
        }
    })

    bot.action('❌ No', async (ctx) => {
        try {
            handleWithdrawCancel(ctx)
        } catch (e) {
            console.log(e)
        }
    })
}
