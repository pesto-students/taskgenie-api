const httpStatus = require('http-status');

/**
 * middleware to validate request body against schema
 * @param {JoiSchema} schema
 * @returns
 */
const validateRequest = (schema) => async (req, res, next) => {
  const result = schema.validate(req.body);
  if (result.error) {
    res.status(httpStatus.BAD_REQUEST);
    return res.json({ error: result.error.details[0].message });
  }
  if (!req.value) {
    req.value = {};
  }
  req.value.body = result.value;
  next();
  return null;
};

module.exports = {
  validateRequest,
};
