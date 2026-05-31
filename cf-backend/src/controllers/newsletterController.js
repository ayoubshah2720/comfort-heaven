const response = require('../utils/response');
const prisma = require('../db/prisma');

async function subscribe(req, res, next) {
  try {
    const { email } = req.body;

    await prisma.newsletterSubscriber.upsert({
      where: { email },
      create: { email },
      update: {},
    });

    return response(res, {
      status: 'success',
      message: 'Subscribed successfully',
      data: null,
      status_code: 201,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { subscribe };
