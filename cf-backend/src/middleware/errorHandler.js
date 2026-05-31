const multer = require('multer');
const response = require('../utils/response');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let status_code = err.status_code || 500;
  let message = err.message || 'Internal Server Error';

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      status_code = 413;
      message = 'File too large. Maximum size is 5MB';
    }
  } else if (err.code === 'LIMIT_FILE_TYPE') {
    status_code = err.status_code || 400;
    message = err.message || 'Invalid file type. Only jpg, jpeg, png, and webp are allowed';
  } else if (err.code === 'P2025') {
    status_code = 404;
    message = 'Resource not found';
  }

  return response(res, {
    status: 'error',
    message,
    data: null,
    status_code
  });
}

module.exports = errorHandler;
