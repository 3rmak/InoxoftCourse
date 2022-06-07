const ErrorHandler = require('../errors/ErrorHandler');

const httpStatusCodes = require('../config/httpStatusCodes');

// не знаю чи можна назвати це хуком. підкажіть як правильно
const isReqBodyValid = (validator = false) => (req, res, next) => {
  try {
    if (!validator) {
      next();
    }

    const { error, value } = validator.validate(req.body);

    if (error) {
      throw new ErrorHandler(httpStatusCodes.Bad_Request, error.details[0].message);
    }

    req.body = value;

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = isReqBodyValid;
