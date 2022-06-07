const Joi = require('joi');

const { validation, userRoleEnum } = require('../config');

const UserCreateValidator = Joi.object({
  email: Joi.string()
    .email({
      tlds: {
        allow: [
          'com',
          'net',
          'ua'
        ]
      }
    })
    .lowercase()
    .regex(validation.EMAIL_REGEX)
    .required(),

  name: Joi.string()
    .regex(validation.NAME_REGEX)
    .trim()
    .required(),

  surname: Joi.string()
    .regex(validation.NAME_REGEX)
    .trim()
    .required(),

  age: Joi.number()
    .integer()
    .min(validation.currentYear - 120)
    .max(validation.currentYear - 6),

  role: Joi.string()
    .allow(...Object.values(userRoleEnum))
    .required(),

  password: Joi.string()
    .regex(validation.PASS_REGEX)
    .trim()
    .required(),
});

const UserPatchValidator = Joi.object({
  name: Joi.string()
    .trim()
    .regex(validation.NAME_REGEX),

  surname: Joi.string()
    .trim()
    .regex(validation.NAME_REGEX),

  age: Joi.number()
    .integer()
    .min(validation.currentYear - 120)
});

module.exports = {
  UserCreateValidator,
  UserPatchValidator
};