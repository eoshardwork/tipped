const Redis = require('ioredis');
const { REDIS_URI } = require('../constants')
const redis = new Redis(REDIS_URI);

module.exports = redis