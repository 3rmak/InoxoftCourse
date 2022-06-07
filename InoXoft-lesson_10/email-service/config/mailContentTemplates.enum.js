const { WELCOME, SUBMIT_REG, FORGOT_PASS } = require('./mailNameTemplates.enum');

module.exports = {
  [WELCOME]: 'Welcome to our company! More about us in our website!',
  [SUBMIT_REG]: 'Thank you for your interest. Confirm your email!',
  [FORGOT_PASS]: 'Forgot your password? To reset press the button below!\nReceived this email accidently? Ignore it.'
};
