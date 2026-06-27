const app = require('./app');
const env = require('./config/env');
const prisma = require('./db/prisma');
const pgPool = require('./db/pg');

const server = app.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`API running on port ${env.port}`);
});

async function shutdown(signal) {
  // eslint-disable-next-line no-console
  console.log(`${signal} received, shutting down gracefully`);

  server.close(async () => {
    try {
      await prisma.$disconnect();
      await pgPool.end();
      process.exit(0);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Shutdown error', err);
      process.exit(1);
    }
  });
}

['SIGINT', 'SIGTERM'].forEach((signal) => {
  process.on(signal, () => {
    shutdown(signal);
  });
});

process.on('unhandledRejection', async (err) => {
  // eslint-disable-next-line no-console
  console.error('Unhandled rejection', err);
  await shutdown('unhandledRejection');
});
