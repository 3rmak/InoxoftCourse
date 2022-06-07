const Joi = require('joi');

const DepartmentPostValidator = Joi.object({
  name: Joi.string()
    .min(2).max(40)
    .alphanum()
    .trim()
    .required(),

  owner: Joi.string()
    .trim()
    .min(3).max(40)
    .required()

});

const DepartmentPatchValidator = Joi.object({
  name: Joi.string()
    .min(2).max(40)
    .alphanum()
    .trim(),

  owner: Joi.string()
    .trim()
    .min(3).max(40)

});

module.exports = {
  DepartmentPostValidator,
  DepartmentPatchValidator
};
