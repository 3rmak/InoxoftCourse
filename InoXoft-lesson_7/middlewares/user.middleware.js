const ErrorHandler = require('../errors/ErrorHandler');

const { User } = require('../models');

const { validation, httpStatusCodes } = require('../config');

module.exports = {
  isUserById: async (req, res, next) => {
    try {
      const { userId } = req.params;

      const user = await User.findById(userId);

      if (!user) {
        throw new ErrorHandler(httpStatusCodes.Not_Found, 'User with id not found');
      }

      req.locals = {
        ...req.locals,
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

      req.locals = {
        ...req.locals,
        user: req.body
      };

      next();
    } catch (error) {
      next(error);
    }
  },

  isObjectId: (req, res, next) => {
    try {
      const { userId } = req.params;
      const isObjId = validation.ID_REGEX.test(userId);

      if (isObjId) {
        throw new ErrorHandler(400, 'Bad id');
      }

      next();
    } catch (error) {
      next(error);
    }
  },

  hasUserRoleAccess: (roleArray = []) => async (req, res, next) => {
    try {
      const { dbToken } = req.locals;
      const userId = dbToken.user._id;

      const user = await User.findById(userId);

      if (!user) {
        throw new ErrorHandler(httpStatusCodes.Gone, 'Can not find user by his token');
      }

      if (!roleArray.length) {
        next();
      }

      if (!roleArray.includes(user.role)) {
        throw new ErrorHandler(httpStatusCodes.Forbidden, 'Forbidden');
      }

      next();
    } catch (error) {
      next(error);
    }
  },

  getUserByDynamicParams: (paramName, searchIn = 'body', dbFieldName = paramName) => async (req, res, next) => {
    try {
      const value = req[searchIn][paramName];

      const user = await User.findOne({ [dbFieldName]: value }).select('+password');

      if (!user) {
        throw new ErrorHandler(httpStatusCodes.Not_Found, 'User with param is not found');
      }

      req.locals = {
        ...req.locals,
        user
      };

      next();
    } catch (error) {
      next(error);
    }
  }
};
