const cors = require('cors');
const helmet = require('helmet');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUI = require('swagger-ui-express');

const app = express();

require('dotenv').config();

const { db, httpStatusCodes, rateLimits: { WINDOW_MS, MAX } } = require('./config');
const cronJobs = require('./cron');
const Sentry = require('./logs/sentry');
const swaggerJson = require('./docs/swagger.json');
const { userRoutes, departmentRoutes, authRoutes } = require('./routes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(helmet());

if (process.env.ENV === 'dev') {
  app.use(morgan('dev'));
}
app.use(Sentry.Handlers.requestHandler());

app.use(rateLimit({ windowMs: WINDOW_MS, max: MAX }));

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerJson, { explorer: true }));

app.get('/', (req, res) => res.send('Alive'));

app.use('/api/users', userRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/', authRoutes);

app.use(Sentry.Handlers.errorHandler({
  shouldHandleError() {
    return true;
  }
}));
app.use(_MainErrorHandler);

mongoose.connect(db.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

app.listen(db.PORT, () => {
  console.log('server started successfully');
  cronJobs();
});

// eslint-disable-next-line no-unused-vars
function _MainErrorHandler(err, req, res, next) {
  res
    .status(err.status || httpStatusCodes.Internal_Server_Error)
    .json({
      message: (err.message || 'Unknown err')
    });
}
