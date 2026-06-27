const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const env = require('../config/env');

function signAccessToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role },
    env.jwtAccessSecret,
    { expiresIn: env.accessExpiresIn }
  );
}

function signRefreshToken(user) {
  const jti = crypto.randomUUID();
  const token = jwt.sign(
    { sub: user.id, jti },
    env.jwtRefreshSecret,
    { expiresIn: `${env.refreshExpiresInDays}d` }
  );
  const expiresAt = new Date(Date.now() + env.refreshExpiresInDays * 24 * 60 * 60 * 1000);
  return { token, jti, expiresAt };
}

function getCookieOptions() {
  const options = {
    httpOnly: true,
    secure: env.isProd,
    sameSite: env.isProd ? 'none' : 'lax',
    path: '/',
    maxAge: env.refreshExpiresInDays * 24 * 60 * 60 * 1000
  };

  if (env.cookieDomain) {
    options.domain = env.cookieDomain;
  }

  return options;
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  getCookieOptions
};
