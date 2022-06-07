const ErrorHandler = require('../errors/ErrorHandler');

const { OAuth } = require('../models');

const { reqFieldsEnum, httpStatusCodes, oauthFieldsEnum } = require('../config');
const { tokenService } = require('../services');

module.exports = {
  tokenVerification: (tokenType = 'access', tokenFrom = 'header') => async (req, res, next) => {
    try {
      const token = tokenFrom === 'header' ? req.get(reqFieldsEnum.AUTHORIZATION) : req.query.access_token;

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
};
