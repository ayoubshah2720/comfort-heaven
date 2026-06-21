const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const env = require('./config/env');
const pgPool = require('./db/pg');
const authRoutes = require('./routes/authRoutes');
const publicRoutes = require('./routes/publicRoutes');
const adminRoutes = require('./routes/adminRoutes');
const imageRoutes = require('./routes/imageRoutes');
const errorHandler = require('./middleware/errorHandler');
const response = require('./utils/response');

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || env.clientOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    exposedHeaders: ['set-cookie']
  })
);

app.get('/health', (req, res) => {
  return response(res, {
    status: 'success',
    message: 'OK',
    data: { status: 'up' },
    status_code: 200
  });
});

app.get('/health/db', async (req, res, next) => {
  try {
    await pgPool.query('SELECT 1');
    return response(res, {
      status: 'success',
      message: 'DB OK',
      data: { status: 'up' },
      status_code: 200
    });
  } catch (err) {
    err.status_code = 500;
    err.message = 'DB connection failed';
    return next(err);
  }
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1', publicRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/image', imageRoutes);

app.use(errorHandler);

module.exports = app;
