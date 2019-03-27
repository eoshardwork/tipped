<div align="center">
<br>
<img width="180" src="/logo.png" alt="Tipped">
<br>
</div>

<p align="center" color="#6a737d">
Introducing Tipped, an open-source tip bot to send and receive EOS using just your telegram account!
</p>

<div align="center">

[![forthebadge](http://forthebadge.com/images/badges/built-with-love.svg)](http://forthebadge.com) [![forthebadge](http://forthebadge.com/images/badges/uses-js.svg)](http://forthebadge.com) [![forthebadge](http://forthebadge.com/images/badges/makes-people-smile.svg)](http://forthebadge.com)

</div>

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

