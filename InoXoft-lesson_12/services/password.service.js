const bcrypt = require('bcrypt');

const { salt, httpStatusCodes } = require('../config');
const ErrorHandler = require('../errors/ErrorHandler');

module.exports = {
  hashPass: (password) => bcrypt.hash(password, salt.saltRounds),
  isPassMatches: async (password, hashedPass) => {
    try {
      const isMatch = await bcrypt.compare(password, hashedPass);

      if (!isMatch) {
        throw new ErrorHandler(httpStatusCodes.Bad_Request, 'Email or password is wrong');
      }
    } catch (error) {
      throw new ErrorHandler(httpStatusCodes.Internal_Server_Error, 'Internal async operation error');
    }
  }
};
