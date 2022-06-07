module.exports = {
  WELCOME: process.env.MAIL_WELCOME_TEMPLATE || 'word',
  SUBMIT_REG: process.env.MAIL_REG_SUBMIT_TEMPLATE || 'word',
  FORGOT_PASS: process.env.MAIL_FORGOT_PASS_TEMPLATE || 'word'
};
