const path = require('path');

const ErrorHandler = require('../errors/ErrorHandler');

const { db, httpStatusCodes, mailNameTemplatesEnum } = require('../config');

const { OAuth, User } = require('../models');

const mailServise = require('../email-service/app');

const { passwordService, tokenService } = require('../services');
const { userNormalizator } = require('../utils');

module.exports = {
  activateUser: async (req, res, next) => {
    try {
      const { user } = req.locals;

      await User.findByIdAndUpdate(user._id, {
        isActive: true
      });

      await mailServise.sendBroadcastMail(user.email, mailNameTemplatesEnum.WELCOME,
        {
          userName: user.name,
          buttonLink: 'https://inoxoft.com'
        });

      res.redirect('/');
    } catch (error) {
      next(error);
    }
  },

  forgotPass: async (req, res, next) => {
    try {
      const { user } = req.locals;

      const { access_token, refresh_token } = tokenService.createUserTokens('15m', '15m');

      const token = await OAuth.create({ access_token, refresh_token, user: user._id });

      const buttonLink = path.join(db.BACKEND_IP, `reset_password?access_token=${access_token}`);

      await mailServise.sendBroadcastMail(user.email, mailNameTemplatesEnum.FORGOT_PASS, {
        userName: user.name,
        buttonLink
      });

      res.json(token);
    } catch (error) {
      next(error);
    }
  },

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
  },

  resetPass: async (req, res, next) => {
    try {
      if (!req.body.password) {
        throw new ErrorHandler(httpStatusCodes.Bad_Request, 'Bad request data');
      }

      const { dbToken } = req.locals;
      const { password } = req.body;

      const hashedPass = passwordService.hashPass(password);

      if (!dbToken) {
        throw new ErrorHandler(httpStatusCodes.Gone, 'Token is dead');
      }

      await User.findByIdAndUpdate(dbToken.user, {
        password: hashedPass
      });

      res.json({ message: 'Changed successfully' });
    } catch (error) {
      next(error);
    }
  }
};
