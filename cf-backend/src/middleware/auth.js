const jwt = require('jsonwebtoken');
const env = require('../config/env');
const response = require('../utils/response');

function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    let token = null;

    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.replace('Bearer ', '').trim();
    }

    if (!token && req.cookies && req.cookies[env.accessCookieName]) {
      token = req.cookies[env.accessCookieName];
    }

    if (!token) {
      return response(res, {
        status: 'error',
        message: 'Unauthorized',
        data: null,
        status_code: 401
      });
    }

    const payload = jwt.verify(token, env.jwtAccessSecret);
    req.user = { id: payload.sub, role: payload.role };
    return next();
  } catch (err) {
    return response(res, {
      status: 'error',
      message: 'Unauthorized',
      data: null,
      status_code: 401
    });
  }
}

function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return response(res, {
        status: 'error',
        message: 'Forbidden',
        data: null,
        status_code: 403
      });
    }
    return next();
  };
}

module.exports = { authenticate, authorizeRoles };
