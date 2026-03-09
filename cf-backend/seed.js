require('dotenv').config();

const prisma = require('./src/db/prisma');
const runSeed = require('./src/seed/runSeed');

runSeed()
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
