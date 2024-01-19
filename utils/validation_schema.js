const Joi = require('joi');
const joi = require('joi');

const authSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(8).required()
});

//exporting in object because there could me more validations required in future.
module.exports = {
    authSchema
}