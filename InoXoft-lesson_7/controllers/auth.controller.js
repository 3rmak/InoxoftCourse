const ErrorHandler = require('../errors/ErrorHandler');

const { httpStatusCodes } = require('../config');

const { OAuth } = require('../models');

const { passwordService, tokenService } = require('../services');
const { userNormalizator } = require('../utils');

module.exports = {
  loginUser: async (req, res, next) => {
    try {
      const { password } = req.body;

      let { user } = req.locals;

      const { access_token, refresh_token } = tokenService.createUserTokens();

      await passwordService.isPassMatches(password, user.password);
      user = userNormalizator.normalization(user);

      await OAuth.create({ access_token, refresh_token, user: user._id });

      res.json({
        access_token,
        refresh_token,
        user
      });
    } catch (error) {
      next(error);
    }
  },

  logoutUser: async (req, res) => {
    try {
      const { dbToken } = req.locals;

      await OAuth.findOneAndRemove({ access_token: dbToken.access_token });

      res.status(httpStatusCodes.Accepted)
        .json({ message: 'Removed successfully', dbToken });
    } catch (error) {
      throw new ErrorHandler(httpStatusCodes.Gone, 'Can not remove token from database');
    }
  },

  refreshToken: async (req, res, next) => {
    try {
      const { dbToken } = req.locals;

      const { access_token, refresh_token } = tokenService.createUserTokens();

      const item = await OAuth.findOneAndUpdate({ refresh_token: dbToken.refresh_token },
        {
          access_token,
          refresh_token
        });

      res.json({
        message: 'Tokens refreshed',
        access_token,
        refresh_token,
        user: item.user
      });
    } catch (error) {
      next(error);
    }
  }
};
