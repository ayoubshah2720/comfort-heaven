function response(res, { status = 'success', message = '', data = null, status_code = 200 }) {
  return res.status(status_code).json({ status, message, data, status_code });
}

module.exports = response;
