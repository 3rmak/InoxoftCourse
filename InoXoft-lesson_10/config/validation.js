module.exports = {
  // eslint-disable-next-line no-useless-escape
  EMAIL_REGEX: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  NAME_REGEX: /^[a-z ,.'-]+$/i,
  PASS_REGEX: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
  ID_REGEX: /[a-f]{24}/,
  currentYear: (new Date()).getYear()
};
