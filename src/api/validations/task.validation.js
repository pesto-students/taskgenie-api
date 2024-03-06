const Joi = require('joi');

const taskSchema = Joi.object({
  title: Joi.string().required(),
  locationType: Joi.string().valid('in-person', 'remote').required(),
  location: Joi.when('locationType', {
    is: 'in-person',
    then: Joi.object({
      name: Joi.string().required(),
      coordinates: Joi.array().items(Joi.number()).length(2).required(),
    }).required(),
    otherwise: Joi.forbidden(),
  }),
  dateType: Joi.string().valid('on', 'before', 'flexible').required(),
  date: Joi.when('dateType', {
    is: Joi.valid('on', 'before'),
    then: Joi.date().iso().required(),
    otherwise: Joi.optional(),
  }),
  description: Joi.string().max(1000).required(),
  imageURLs: Joi.array()
    .items(Joi.string().uri().max(500).required())
    .max(3)
    .required(),
  budget: Joi.number().integer().min(100).max(99000)
    .required(),
});

module.exports = taskSchema;
