const outdent = require('outdent');
const { MAXIMUM_TIP, MAXIMUM_MONTHLY_WITHDRAW, TOKEN_SYMBOL, COMPANY_NAME, SUPPORT_TELEGRAM_GROUP } = require('./index')

const disclaimer = outdent`
<b>Disclaimer</b>
Tipped is a telegram bot provided on an "as is" basis. To the extent permitted by law, ${COMPANY_NAME} disclaims \
all warranties, express or implied, including, but not limited to, implied warranties of merchantability and fitness \
for a particular purpose. ${COMPANY_NAME} does not warrant that the functionality or operation of the telegram bot will be \
uninterrupted or free from error, that any defects in the bot will be corrected, or that the server(s) that makes \
it available are free of errors or other harmful conditions.

${COMPANY_NAME} may change the programs or products mentioned at any time without notice. All information provided including \
but not limited to balances are retrieved directly from EOSIO blockchain APIs, and ${COMPANY_NAME} does not warrant the \
accuracy of the information.

<b>Limitation of Liability</b>
To the extent permitted by law, ${COMPANY_NAME} disclaims liability, whether \
based in contract, tort, negligence, strict liability or otherwise, for damages of any kind \
(including, but not limited to, direct, indirect, incidental, consequential, special, punitive or \
exemplary damages) in any way arising from the functionality, operation, or the information \
provided by this telegram bot (including, but not limited to, damages arising from interruptions of \
service or delays in operation or transmission), even if ${COMPANY_NAME} is \
expressly advised of the possibility of such damages.
`

const introText = outdent`
Introducing Tipped, a way to send and receive EOS using just your telegram account!
`

const supportText = outdent`
This bot is only intended for micro-transactions. This bot is not a wallet, your funds are only as secure \
as your telegram account. All transactions are public and traceable to the original sender. By using this \
bot, you agree to these terms and the full disclaimer at /disclaimer. To prevent Tipped from being used for \
money laundering, we have set a tip limit of ${MAXIMUM_TIP} ${TOKEN_SYMBOL} per tip and a withdrawal limit \
of ${MAXIMUM_MONTHLY_WITHDRAW} ${TOKEN_SYMBOL} per month. 
`

const helpText = outdent`
/tip X EOS MEMO — Reply to a message with for example "/tip 0.1234 EOS :)" to tip a user!
/deposit - View deposit instructions containing your unique telegram ID.
/withdraw EOSACCOUNT AMOUNT SYMBOL [MEMO] - Withdraw to a EOS account.
/createaccount PUBLICKEY [ACCOUNTNAME] - Create an EOS account from telegram.
/balance - Check your balance.
/help - See this message again.
`

const introduction = outdent`
<b>Tipped: The First EOS Tip Bot</b>
${introText}

<b>Tipped: Commands</b>
${helpText}

<b>Tipped: Support</b>
${supportText}

Got questions? Want to see it in action? Join our telegram group ${SUPPORT_TELEGRAM_GROUP}!
`

const startMessage = (tipContract, userId) => outdent`
<b>Tipped: The First EOS Tip Bot</b>
${introText}

<b>Deposits:</b>
Send EOS to <b>${tipContract}</b> with the memo <b>${userId}</b>

<b>All Commands:</b>
${helpText}

<b>Read First:</b>
${supportText}

Got questions? Want to see it in action? Join our telegram group ${SUPPORT_TELEGRAM_GROUP}!
`

const tipFormat = outdent`
<b>Format:</b> /tip X EOS MEMO
<b>Example:</b> /tip 1.2345 EOS eosio
`
const withdrawFormat = outdent`
<b>Format:</b> /withdraw EOSACCOUNT AMOUNT SYMBOL MEMO
<b>Example:</b> /withdraw eosio 3.4567 EOS with love from eosio
`

module.exports = {
    disclaimer,
    helpText,
    introduction,
    startMessage,
    tipFormat,
    withdrawFormat
}