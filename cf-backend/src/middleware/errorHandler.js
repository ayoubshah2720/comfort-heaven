const response = require('../utils/response');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status_code = err.status_code || 500;
  const message = err.message || 'Internal Server Error';
  return response(res, {
    status: 'error',
    message,
    data: null,
    status_code
  });
}

module.exports = errorHandler;
