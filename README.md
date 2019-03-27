# Tipped
Introducing Tipped, an open-source tip bot to send and receive EOS using just your telegram account!

# Commands
```
/tip X EOS MEMO — Reply to a message with for example "/tip 0.1234 EOS :)" to tip a user!
/deposit - View deposit instructions containing your unique telegram ID.
/withdraw EOSACCOUNT AMOUNT SYMBOL [MEMO] - Withdraw to a EOS account.
/createaccount PUBLICKEY [ACCOUNTNAME] - Create an EOS account from telegram.
/balance - Check your balance.
/help - See this message again.
```

# Dependencies
1. nodejs8+
2. yarn
3. redis 

# Running
1. Modify config.json with your own information
2. `yarn start`

