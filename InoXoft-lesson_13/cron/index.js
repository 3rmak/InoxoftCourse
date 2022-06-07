const cron = require('node-cron');

const { cronTiming } = require('../config');

const removeExpiredJwt = require('./removeExpiredJwt');

module.exports = () => {
  cron.schedule(cronTiming.EVERY_MONTH_ON_3_AM, removeExpiredJwt.removeByExpiredRefresh);
};
