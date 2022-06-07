const express = require('express');
const mongoose = require('mongoose');

const app = express();

const { mongoURI, PORT } = require('./config/db');
const { httpStatusCodes } = require('./config');

require('dotenv').config();

const { userRoutes, departmentRoutes } = require('./routes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send('Alive'));

app.use('/api/users', userRoutes);
app.use('/api/departments', departmentRoutes);

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
