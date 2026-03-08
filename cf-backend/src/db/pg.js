const { Pool } = require('pg');
require('dotenv').config();

const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

const pool = new Pool(
  hasDatabaseUrl
    ? { connectionString: process.env.DATABASE_URL }
    : {
        host: process.env.PG_HOST || '127.0.0.1',
        port: Number(process.env.PG_PORT || 5433),
        user: process.env.PG_USER || 'ayoubshah',
        password: String(process.env.PG_PASSWORD || 'Ay12345'),
        database: process.env.PG_DATABASE || 'cfheaven'
      }
);

pool.on('error', (err) => {
  // eslint-disable-next-line no-console
  console.error('Unexpected PG client error', err);
});

module.exports = pool;
