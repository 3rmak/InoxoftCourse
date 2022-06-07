const ErrorHandler = require('../errors/ErrorHandler');
const { User } = require('../models');

const httpStatusCodes = require('../config/httpStatusCodes');

module.exports = {
  isUserById: async (req, res, next) => {
    try {
      const { userId } = req.params;

      const user = await User.findById(userId);

      if (!user) {
        throw new ErrorHandler(httpStatusCodes['Not Found'], 'User with id not found');
      }

      req.locals = {
        user
      };

      next();
    } catch (error) {
      next(error);
    }
  },

  isEmailUsed: async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      if (user) {
        throw new ErrorHandler(httpStatusCodes.Conflict, 'User with email already exist');
      }

      next();
    } catch (error) {
      next(error);
    }
  }
};
