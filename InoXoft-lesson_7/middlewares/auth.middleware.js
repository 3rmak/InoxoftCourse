const ErrorHandler = require('../errors/ErrorHandler');

const { OAuth } = require('../models');

const { reqHeaders, httpStatusCodes, oauthFieldsEnum } = require('../config');
const { tokenService } = require('../services');

module.exports = {
  isTokenBelongsUser: (req, res, next) => {
    try {
      const token = req.locals.dbToken;
      const userToken = token.user.toString();

      const { userId } = req.params;

      if (userToken !== userId) {
        throw new ErrorHandler(httpStatusCodes.Forbidden, 'Can not patch another user');
      }
      // next();
    } catch (error) {
      next(error);
    }
  },
  tokenVerification: (tokenType = 'access') => async (req, res, next) => {
    try {
      const token = req.get(reqHeaders.AUTHORIZATION);

      if (!token) {
        throw new ErrorHandler(httpStatusCodes.Bad_Request, 'Request without token');
      }

      const tokenVariable = tokenType === 'access' ? oauthFieldsEnum.ACCESS_TOKEN : oauthFieldsEnum.REFRESH_TOKEN;

      await tokenService.verifyUserToken(token, tokenType);

      const dbToken = await OAuth.findOne({ [tokenVariable]: token });

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

  // refreshTokenVerification: async (req, res, next) => {
  //   try {
  //     const token = req.get(reqHeaders.AUTHORIZATION);

  //     if (!token) {
  //       throw new ErrorHandler(httpStatusCodes.Bad_Request, 'Request without token');
  //     }

  //     await tokenService.verifyUserToken(token, 'refresh');

  //     const dbToken = await OAuth.findOne({ refresh_token: token });

  //     if (!dbToken) {
  //       throw new ErrorHandler(httpStatusCodes.Unauthorized, 'Bad token');
  //     }

  //     req.locals = {
  //       ...req.locals,
  //       dbToken
  //     };

  //     next();
  //   } catch (error) {
  //     next(error);
  //   }
  // }
};
