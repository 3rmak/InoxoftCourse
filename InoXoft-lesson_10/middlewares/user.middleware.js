const formidable = require('formidable');

const ErrorHandler = require('../errors/ErrorHandler');

const { User } = require('../models');

const {
  reqFieldsEnum,
  reqContentTypesEnum: { APPLICATION_JSON },
  httpStatusCodes,
  validation,
  userRoleEnum
} = require('../config');

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

  isUserActive: (req, res, next) => {
    try {
      const { user } = req.locals;

      if (!user.isActive) {
        throw new ErrorHandler(httpStatusCodes.Not_Found, 'User with param is not found or not active');
      }

      next();
    } catch (error) {
      next(error);
    }
  },

  hasUserAccess: (roleArray = []) => async (req, res, next) => {
    try {
      const { dbToken } = req.locals;

      const user = await User.findOne({ _id: dbToken.user });

      if (!roleArray.length) {
        next();
      }

      if (!roleArray.includes(user.role)) {
        throw new ErrorHandler(httpStatusCodes.Forbidden, 'Forbidden');
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

  isCreatesManager: (req, res, next) => {
    try {
      const { user } = req.locals;

      if (user.role !== userRoleEnum.Manager) {
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

      const user = await User.findOne({ [dbFieldName]: value }).select('+password +isActive');

      if (!user) {
        throw new ErrorHandler(httpStatusCodes.Not_Found, 'User with param is not found or not active');
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

  parseFormData: (req, res, next) => {
    try {
      if (req.headers[reqFieldsEnum.CONTENT_TYPE].includes(APPLICATION_JSON)) {
        return next();
      }

      const form = formidable({ multiples: true });

      form.parse(req, (err, fields, files) => {
        if (err) {
          throw new ErrorHandler('Error while parsing form-data request');
        }

        req.body = {
          ...req.body,
          ...fields
        };

        req.files = files;
        next();
      });
    } catch (error) {
      next(error);
    }
  }
};
