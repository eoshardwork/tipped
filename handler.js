'use strict';

const bot = require('./src')

module.exports.mainnet = async (event) => {
  if (event && event.body) {
    const tmp = JSON.parse(event.body);
    await bot.handleUpdate(tmp); 
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Tipped!',
      event: event
    })
  }
};
