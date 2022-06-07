const ErrorHandler = require('../errors/ErrorHandler');
const { User } = require('../models');
const { isEmail, isPassDifficult } = require('../services/user.services');

const httpStatusCodes = require('../config/httpStatusCodes');

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const users = await User.find();

      res.json(users);
    } catch (error) {
      next(error);
    }
  },

  // eslint-disable-next-line no-unused-vars
  getById: (req, res, next) => {
    try {
      const { user } = req.locals;

      res.json(user);
    } catch (error) {
      next(error);
    }
  },

  updateUser: async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { name, surname, age } = req.body;

      if (!name || !surname || !age) {
        throw new ErrorHandler(httpStatusCodes['Bad Request'], 'Not fully requested data');
      }

      await User.findByIdAndUpdate(userId, {
        name,
        surname,
        age
      });

      res.json({
        message: 'Updated successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  createUser: async (req, res, next) => {
    try {
      // eslint-disable-next-line object-curly-newline
      const { email, password, name, surname, age } = req.body;

      if (!name || !surname || !age) {
        throw new ErrorHandler(httpStatusCodes['Bad Request'], 'Not fully requested data');
      }

      if (!isEmail(email) || !isPassDifficult(password)) {
        throw new ErrorHandler(httpStatusCodes['Bad Request'], 'Email or password validation error');
      }

      const user = await User.create(req.body);

      res.status(httpStatusCodes.Created).json(user);
    } catch (error) {
      next(error);
    }
  },

  deleteUser: async (req, res, next) => {
    try {
      const { userId } = req.params;

      await User.findByIdAndRemove(userId);

      res.json({
        message: 'Deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};
