const { httpStatusCodes } = require('../config');

const ErrorHandler = require('../errors/ErrorHandler');

const { User } = require('../models');

module.exports = async (queryParams) => {
  const perPage = queryParams.perPage || 10;
  const page = queryParams.page || 1;

  const filter = {
    age: {
      lte: 149,
      gte: 0
    }
  };

  for (const [
    key,
    value
  ] of Object.entries(queryParams)) {
    switch (key) {
      case 'email':
        filter.email = value;
        break;
      case 'age.lte':
        filter.age.lte = +value;
        break;
      case 'age.gte':
        filter.age.gte = +value;
        break;
    }
  }

  if (filter.age.gte > filter.age.lte) {
    throw new ErrorHandler(httpStatusCodes.Bad_Request, 'Age range is bad');
  }

  console.log(filter);

  const users = await User
    .find({
      age: { $gte: +filter.age.gte, $lte: +filter.age.lte },
    })
    .limit(+perPage)
    .skip((page - 1) * perPage);

  return users;
};
