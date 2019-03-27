const { withdraw } = require('../utils/eos')
const { TOKEN_CONTRACT, TOKEN_PRECISION, MINIMUM_TIP, BLOKS_URL } = require('../constants')
const Extra = require('telegraf/extra')
const { getMsgId, callbackFromMatchesRepliedMessage } = require('../utils/utils')
const { withdrawFormat } = require('../constants/largeText')

/** 
 * Withdrawal
 */
function handleCreateAccountRequest (ctx) {
    const { text } = ctx['update']['message']
    if (!text) return ctx.reply('No message')

    let splitWithdraw = text.split(' ')
    if (splitWithdraw.length < 3) {
        return ctx.reply(withdrawFormat, Extra.HTML().inReplyTo(getMsgId(ctx)))
    }
    let [, account, amount, symbol] = splitWithdraw

    // Validation
    const validName = account && /(^[a-zA-Z12345.]+$)/.test(account)
    if (!validName) return ctx.reply('Invalid name, make sure it is a valid EOS account.', Extra.markdown().inReplyTo(getMsgId(ctx)))
    if (!symbol || typeof symbol !== 'string') return ctx.reply('Invalid symbol', Extra.markdown().inReplyTo(getMsgId(ctx)))
    symbol = symbol.toUpperCase()
    if (!amount || amount < MINIMUM_TIP) return ctx.reply(`Must withdraw atleast ${MINIMUM_TIP} ${symbol}!`, Extra.markdown().inReplyTo(getMsgId(ctx)))

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

async function handleCreateAccountConfirm (ctx) {
  if (!callbackFromMatchesRepliedMessage(ctx)) return

  // console.dir(ctx, { depth: null })
  const text = ctx['update']['callback_query']['message']['reply_to_message']['text']
  let splitWithdraw = text.split(' ')

  let [, account, amount, symbol] = splitWithdraw
  symbol = symbol.toUpperCase()
  amount = Number(amount)
  const memo = splitWithdraw.length > 4
      ? splitWithdraw.slice(4).join(' ')
      : ''

  const quantity = `${amount.toFixed(TOKEN_PRECISION)} ${symbol}`;

  try {
      const from = ctx['update']['callback_query']['from']['id'];
      const result = await withdraw (TOKEN_CONTRACT, from, account, quantity, memo)

      // TODO change from jungle
      const bloksLink = `<a href="${BLOKS_URL}/transaction/${result['transaction_id']}">(TX)</a>`
      const replyMessage = `Successfully withdrew ${quantity} to ${account}! ${bloksLink}`
      
      ctx.editMessageText(
          replyMessage,
          Extra.HTML().markup((markup) => markup.inlineKeyboard([]))
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

async function handleCreateAccountCancel (ctx) {
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
    bot.hears(/^\/createaccount/, (ctx) => handleCreateAccountRequest(ctx))
    bot.action('✅ Yes', async (ctx) => handleCreateAccountConfirm(ctx))
    bot.action('❌ No', async (ctx) => handleCreateAccountCancel(ctx))
}
