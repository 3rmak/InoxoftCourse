const cron = require('node-cron');
const express = require('express');
const mongoose = require('mongoose');

const app = express();

const { mongoURI, PORT } = require('./config/db');
const { httpStatusCodes, cronTiming } = require('./config');

const removeExpiredJwt = require('./cron/removeExpiredJwt');

require('dotenv').config();

cron.schedule(cronTiming.EVERY_MINUTE, removeExpiredJwt.removeByExpiredRefresh);

const { userRoutes, departmentRoutes, authRoutes } = require('./routes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send('Alive'));

app.use('/api/users', userRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/', authRoutes);

app.use(_MainErrorHandler);

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

app.listen(PORT, () => {
  console.log('server started successfully');
});

// eslint-disable-next-line no-unused-vars
function _MainErrorHandler(err, req, res, next) {
  res
    .status(err.status || httpStatusCodes.Internal_Server_Error)
    .json({
      message: (err.message || 'Unknown err')
    });
}
