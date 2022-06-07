const Sentry = require('@sentry/node');

const { logs } = require('../config');

Sentry.init({
  dsn: logs.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

module.exports = Sentry;
