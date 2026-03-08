const bcrypt = require('bcryptjs');
const prisma = require('./src/db/prisma');

async function main() {
  const email = 'admin@interior.com';
  const password = 'Admin@123';

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      name: 'Admin',
      email,
      passwordHash,
      role: 'ADMIN'
    }
  });
}

main()
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
