const dotenv = require('dotenv');

dotenv.config();

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';

function getRequiredEnv(name, fallback = '') {
  const value = process.env[name] ?? fallback;
  if (isProd && !value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function parseOrigins(value) {
  return String(value || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function parseBoolean(value, fallback = false) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['true', '1', 'yes', 'on'].includes(normalized)) return true;
    if (['false', '0', 'no', 'off'].includes(normalized)) return false;
  }
  return fallback;
}

const clientOrigins = parseOrigins(
  process.env.CLIENT_ORIGINS ||
    process.env.CLIENT_ORIGIN ||
    (isProd ? '' : 'http://localhost:3000')
);

if (isProd && clientOrigins.length === 0) {
  throw new Error('Missing required environment variable: CLIENT_ORIGINS');
}

const env = {
  nodeEnv,
  isProd,
  port: Number(process.env.PORT || 5000),
  clientOrigins,
  appBaseUrl: process.env.APP_BASE_URL || '',
  trustProxy: parseBoolean(process.env.TRUST_PROXY, isProd),
  jwtAccessSecret: getRequiredEnv('JWT_ACCESS_SECRET', isProd ? '' : 'change_me_access'),
  jwtRefreshSecret: getRequiredEnv('JWT_REFRESH_SECRET', isProd ? '' : 'change_me_refresh'),
  accessExpiresIn: process.env.ACCESS_EXPIRES_IN || '15m',
  refreshExpiresInDays: Number(process.env.REFRESH_EXPIRES_IN_DAYS || 7),
  cookieName: process.env.COOKIE_NAME || 'rid',
  accessCookieName: process.env.ACCESS_COOKIE_NAME || 'aid',
  cookieDomain: process.env.COOKIE_DOMAIN || '',
  cloudinaryCloudName: getRequiredEnv('CLOUDINARY_CLOUD_NAME'),
  cloudinaryApiKey: getRequiredEnv('CLOUDINARY_API_KEY'),
  cloudinaryApiSecret: getRequiredEnv('CLOUDINARY_API_SECRET')
};

module.exports = env;
