const bcrypt = require('bcrypt');

const { salt } = require('../config');

module.exports = {
  hashPass: (password) => bcrypt.hash(password, salt.saltRounds),
  isPassMatches: (password, hashedPass) => bcrypt.compare(password, hashedPass)
};
