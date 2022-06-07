const jwt = require('jsonwebtoken');

const { db, httpStatusCodes } = require('../config');
const ErrorHandler = require('../errors/ErrorHandler');

module.exports = {
  createUserTokens: () => {
    const access_token = jwt.sign(
      {},
      db.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    const refresh_token = jwt.sign(
      {},
      db.REFRESH_TOKEN_SECRET,
      { expiresIn: '31d' }
    );

    return {
      access_token,
      refresh_token
    };
  },

  verifyUserToken: (token, tokenType = 'access') => {
    try {
      const secret = tokenType === 'access' ? db.ACCESS_TOKEN_SECRET : db.REFRESH_TOKEN_SECRET;

      jwt.verify(token, secret);
    } catch (error) {
      throw new ErrorHandler(httpStatusCodes.Unauthorized, 'Invalid token');
    }
  },

  cronJobVerifyToken: (token) => {
    try {
      const secret = db.REFRESH_TOKEN_SECRET;

      jwt.verify(token, secret);

      return false;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return true;
      }
    }
  }
};
