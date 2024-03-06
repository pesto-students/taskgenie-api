const Joi = require('joi');

const setupProfileSchema = Joi.object({
  firstname: Joi.string().max(20).required(),
  secondname: Joi.string().max(20).required(),
  city: Joi.string().max(100).required(),
});

module.exports = setupProfileSchema;
