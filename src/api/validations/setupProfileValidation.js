const Joi = require('joi');

const setupProfileSchema = Joi.object({
  firstName: Joi.string().max(20).required(),
  lastName: Joi.string().max(20).required(),
  city: Joi.string().max(100).required(),
  isSetupProfileComplete: Joi.boolean().required(),
});

module.exports = setupProfileSchema;
