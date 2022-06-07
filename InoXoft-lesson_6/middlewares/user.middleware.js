const ErrorHandler = require('../errors/ErrorHandler');

const { isPassMatches } = require('../services/user.services');
const { User } = require('../models');
// const { userValidator } = require('../validators');

const httpStatusCodes = require('../config/httpStatusCodes');
const { validation } = require('../config');

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

  isPasswordMatch: async (req, res, next) => {
    try {
      const { email, password } = req.body();
      const user = await User.findOne({ email }).select('+password');

      const isMatches = await isPassMatches(password, user.password);

      if (!isMatches) {
        throw new ErrorHandler(httpStatusCodes.Bad_Request, 'Email or password is wrong!');
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

  hasUserAccess: (roleArray = []) => (req, res, next) => {
    try {
      const { user } = req.locals;

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

      const user = await User.findOne({ [dbFieldName]: value });

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
