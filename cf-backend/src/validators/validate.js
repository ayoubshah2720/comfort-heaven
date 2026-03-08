const { validationResult } = require('express-validator');
const response = require('../utils/response');

function validate(req, res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return response(res, {
      status: 'error',
      message: 'Validation failed',
      data: result.array(),
      status_code: 422
    });
  }
  return next();
}

module.exports = validate;
