const Joi = require('joi');

const taskSchema = Joi.object({
  title: Joi.string().required(),
  locationType: Joi.string().valid('in-person', 'remote').required(),
  location: Joi.when('locationType', {
    is: 'in-person',
    then: Joi.object({
      name: Joi.string().required(),
      geometry: Joi.object({
        lat: Joi.number().required(),
        lng: Joi.number().required(),
      }).required(),
    }).required(),
    otherwise: Joi.optional(),
  }),
  dateType: Joi.string().valid('on', 'before', 'flexible').required(),
  date: Joi.when('dateType', {
    is: Joi.valid('on', 'before'),
    then: Joi.date().iso().required(),
    otherwise: Joi.optional(),
  }),
  description: Joi.string().max(1000).required(),
  imageURLs: Joi.array()
    .items(Joi.string().uri().max(500).optional())
    .max(3)
    .optional(),
  budget: Joi.number().integer().min(0).max(99000)
    .required(),
});

module.exports = taskSchema;
