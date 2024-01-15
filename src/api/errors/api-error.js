const httpStatus = require('http-status');
const ExtendableError = require('./extendable-error');

/**
 * Class representing an error
 * @extends ExtendableError
 */
class APIError extends ExtendableError {
  /**
   * Creates an API error
   * @param {string} message - Error message
   * @param {number} status - HTTP status code of error
   * @param {boolean} isPublic - Whether the mesage should be visible
   */
  constructor({
    message,
    errors,
    stack,
    status = httpStatus.INTERNAL_SERVER_ERROR,
    isPublic = false,
  }) {
    super({
      message,
      errors,
      status,
      isPublic,
      stack,
    });
  }
}

module.exports = APIError;
