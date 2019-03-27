// Eosjs
const { getBalance } = require('./eos')
const Extra = require('telegraf/extra')

/**
 * Helper functions
 */
const getUserId = (ctx) => ctx['update']['message']['from']['id'];
const getMsgId = (ctx) => ctx['update']['message']['message_id'];

async function showBalance (ctx) {
    const { rows } = await getBalance(getUserId(ctx))

    return ctx.reply(
        rows.map(row => `${row.contract}: <b>${row.balance}</b>`).join('<br/>') || 'User currently has no balance.',
        Extra.HTML().inReplyTo(getMsgId(ctx))
    );
}

function callbackFromMatchesRepliedMessage (ctx) {
    const fromId = ctx['update']['callback_query']['from']['id'];
    const messageSenderId = ctx['update']['callback_query']['message']['reply_to_message']['from']['id'];
    return fromId === messageSenderId
}

module.exports = {
    getUserId,
    getMsgId,
    showBalance,
    callbackFromMatchesRepliedMessage
}