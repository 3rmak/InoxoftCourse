const { User } = require('../models');
const { passwordService } = require('../services');

const mailServise = require('../email-service/app');

const { httpStatusCodes, mailNameTemplatesEnum } = require('../config');

module.exports = {
  createUser: async (req, res, next) => {
    try {
      const { password } = req.body;
      const hashedPassword = await passwordService.hashPass(password);

      delete req.body.repeat_password;

      const user = await User.create({ ...req.body, password: hashedPassword });

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
  },

  getAll: async (req, res, next) => {
    try {
      const users = await User.find();

      res.json(users);
    } catch (error) {
      next(error);
    }
  },

  // eslint-disable-next-line no-unused-vars
  getById: async (req, res, next) => {
    try {
      const { user } = req.locals;

      await mailServise.sendBroadcastMail('r3al3rmak@gmail.com',
        mailNameTemplatesEnum.SUBMIT_REG,
        {
          userName: user.name,
          buttonLink: 'https://inoxoft.com'
        });

      res.json(user);
    } catch (error) {
      next(error);
    }
  },

  updateUser: async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { name, surname, age } = req.body;

      const user = await User.findByIdAndUpdate(userId, {
        name,
        surname,
        age
      });

      res.json({
        message: 'Updated successfully',
        user
      });
    } catch (error) {
      next(error);
    }
  }
};
