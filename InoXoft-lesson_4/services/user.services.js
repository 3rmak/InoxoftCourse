const { emailRegex, passwordLength } = require('../config/validation');

module.exports = {
  isEmail: (email) => emailRegex.test(String(email).toLowerCase()),
  isPassDifficult: (password) => {
    if (password.length < passwordLength) {
      return false;
    }

    return true;
  }
};
