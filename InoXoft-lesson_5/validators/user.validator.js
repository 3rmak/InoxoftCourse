const Joi = require('joi');

const { validation } = require('../config');

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
    .regex(validation.EMAIL_REGEX),

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

  password: Joi.string()
    .regex(validation.PASS_REGEX)
    .trim()
    .required(),

  repeat_password: Joi.ref('password'),

})
  .with('password', 'repeat_password');

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
    .max(validation.currentYear - 6),

});

module.exports = {
  UserCreateValidator,
  UserPatchValidator
};
