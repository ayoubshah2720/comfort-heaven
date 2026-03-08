const dotenv = require('dotenv');

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'change_me_access',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'change_me_refresh',
  accessExpiresIn: process.env.ACCESS_EXPIRES_IN || '15m',
  refreshExpiresInDays: Number(process.env.REFRESH_EXPIRES_IN_DAYS || 7),
  cookieName: process.env.COOKIE_NAME || 'rid',
  accessCookieName: process.env.ACCESS_COOKIE_NAME || 'aid'
};

module.exports = env;
