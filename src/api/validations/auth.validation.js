const Joi = require('joi');

const authSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  refreshToken: Joi.string(),
  role: Joi.string().valid('user', 'admin'),
});

module.exports = {
  authSchema,
};
