const { WELCOME, SUBMIT_REG, FORGOT_PASS } = require('./mailNameTemplates.enum');

module.exports = {
  [WELCOME]: 'Check what\'s new',
  [SUBMIT_REG]: 'Confirm your registration',
  [FORGOT_PASS]: 'Press to reset your pass'
};
