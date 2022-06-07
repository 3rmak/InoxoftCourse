const ErrorHandler = require('../errors/ErrorHandler');

const { OAuth } = require('../models');

const { reqHeaders, httpStatusCodes } = require('../config');
const { tokenService } = require('../services');

module.exports = {
  accessTokenVerification: async (req, res, next) => {
    try {
      const token = req.get(reqHeaders.AUTHORIZATION);

      if (!token) {
        throw new ErrorHandler(httpStatusCodes.Bad_Request, 'Request without token');
      }

      await tokenService.verifyUserToken(token);

      const dbToken = await OAuth.findOne({ access_token: token });

      if (!dbToken) {
        throw new ErrorHandler(httpStatusCodes.Unauthorized, 'Bad token');
      }

      req.locals = {
        ...req.locals,
        dbToken
      };
      next();
    } catch (error) {
      next(error);
    }
  },

  refreshTokenVerification: async (req, res, next) => {
    try {
      const token = req.get(reqHeaders.AUTHORIZATION);

      if (!token) {
        throw new ErrorHandler(httpStatusCodes.Bad_Request, 'Request without token');
      }

      await tokenService.verifyUserToken(token, 'refresh');

      const dbToken = await OAuth.findOne({ refresh_token: token });

      if (!dbToken) {
        throw new ErrorHandler(httpStatusCodes.Unauthorized, 'Bad token');
      }

      req.locals = {
        ...req.locals,
        dbToken
      };

      next();
    } catch (error) {
      next(error);
    }
  }
};
