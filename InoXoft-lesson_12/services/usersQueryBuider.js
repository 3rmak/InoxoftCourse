const { httpStatusCodes } = require('../config');

const ErrorHandler = require('../errors/ErrorHandler');

const { User } = require('../models');

module.exports = {
  findAllUsers: async (queryParams) => {
    const perPage = queryParams.perPage || 10;
    const page = queryParams.page || 1;

    const filter = {
      age: {}
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
          Object.assign(filter.age, { $lte: value });
          break;
        case 'age.gte':
          Object.assign(filter.age, { $gte: value });
          break;
      }
    }

    if (filter.age && filter.age.gte > filter.age.lte) {
      throw new ErrorHandler(httpStatusCodes.Bad_Request, 'Age range is bad');
    }

    if (Object.keys(filter.age).length === 0) {
      delete filter.age;
    }

    const users = await User
      .find(filter)
      .limit(+perPage)
      .skip((page - 1) * perPage);

    const countOfPages = await User.countDocuments(filter);

    return { users, countOfPages: Math.ceil(countOfPages / perPage) };
  }
};
