const response = require('../utils/response');
const prisma = require('../db/prisma');

function buildQuoteItemData(items) {
  return (items || []).map((item) => ({
    product: { connect: { id: item.productId } },
    quantity: Number(item.quantity || 1)
  }));
}

async function validateQuoteProducts(items = []) {
  const productIds = Array.from(new Set(items.map((item) => item.productId)));

  if (productIds.length === 0) {
    return 'Quote must include at least one item';
  }

  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true }
  });

  if (products.length !== productIds.length) {
    return 'One or more products are invalid';
  }

  return null;
}

async function listQuotes(req, res, next) {
  try {
    const { status } = req.query;

    const quotes = await prisma.quote.findMany({
      where: {
        userId: req.user.id,
        ...(status ? { status } : {})
      },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, slug: true, imageUrl: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return response(res, {
      status: 'success',
      message: 'Quotes',
      data: quotes,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function getQuoteById(req, res, next) {
  try {
    const { quoteId } = req.params;

    const quote = await prisma.quote.findFirst({
      where: {
        id: quoteId,
        userId: req.user.id
      },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, slug: true, imageUrl: true }
            }
          }
        }
      }
    });

    if (!quote) {
      return response(res, {
        status: 'error',
        message: 'Quote not found',
        data: null,
        status_code: 404
      });
    }

    return response(res, {
      status: 'success',
      message: 'Quote',
      data: quote,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function createQuote(req, res, next) {
  try {
    const { notes, items } = req.body;

    const validationError = await validateQuoteProducts(items);
    if (validationError) {
      return response(res, {
        status: 'error',
        message: validationError,
        data: null,
        status_code: 400
      });
    }

    const quote = await prisma.quote.create({
      data: {
        userId: req.user.id,
        notes,
        items: {
          create: buildQuoteItemData(items)
        }
      },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, slug: true, imageUrl: true }
            }
          }
        }
      }
    });

    return response(res, {
      status: 'success',
      message: 'Quote created',
      data: quote,
      status_code: 201
    });
  } catch (err) {
    return next(err);
  }
}

async function acceptQuote(req, res, next) {
  try {
    const { quoteId } = req.params;

    const quote = await prisma.quote.findFirst({
      where: {
        id: quoteId,
        userId: req.user.id
      }
    });
    if (!quote) {
      return response(res, {
        status: 'error',
        message: 'Quote not found',
        data: null,
        status_code: 404
      });
    }

    if (quote.status !== 'SENT') {
      return response(res, {
        status: 'error',
        message: 'Quote can only be accepted after it is sent',
        data: null,
        status_code: 400
      });
    }

    const updated = await prisma.quote.update({
      where: { id: quoteId },
      data: { status: 'ACCEPTED' },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, slug: true, imageUrl: true }
            }
          }
        }
      }
    });

    return response(res, {
      status: 'success',
      message: 'Quote accepted',
      data: updated,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function rejectQuote(req, res, next) {
  try {
    const { quoteId } = req.params;

    const quote = await prisma.quote.findFirst({
      where: {
        id: quoteId,
        userId: req.user.id
      }
    });
    if (!quote) {
      return response(res, {
        status: 'error',
        message: 'Quote not found',
        data: null,
        status_code: 404
      });
    }

    if (quote.status !== 'SENT') {
      return response(res, {
        status: 'error',
        message: 'Quote can only be rejected after it is sent',
        data: null,
        status_code: 400
      });
    }

    const updated = await prisma.quote.update({
      where: { id: quoteId },
      data: { status: 'REJECTED' },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, slug: true, imageUrl: true }
            }
          }
        }
      }
    });

    return response(res, {
      status: 'success',
      message: 'Quote rejected',
      data: updated,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function listAdminQuotes(req, res, next) {
  try {
    const { status, userId } = req.query;

    const quotes = await prisma.quote.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(userId ? { userId } : {})
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: {
          include: {
            product: {
              select: { id: true, name: true, slug: true, imageUrl: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return response(res, {
      status: 'success',
      message: 'Quotes',
      data: quotes,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function createAdminQuote(req, res, next) {
  try {
    const { userId, notes, status, items } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return response(res, {
        status: 'error',
        message: 'User not found',
        data: null,
        status_code: 404
      });
    }

    const validationError = await validateQuoteProducts(items);
    if (validationError) {
      return response(res, {
        status: 'error',
        message: validationError,
        data: null,
        status_code: 400
      });
    }

    const quote = await prisma.quote.create({
      data: {
        userId,
        notes,
        status: status || 'PENDING',
        items: {
          create: buildQuoteItemData(items)
        }
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: {
          include: {
            product: {
              select: { id: true, name: true, slug: true, imageUrl: true }
            }
          }
        }
      }
    });

    return response(res, {
      status: 'success',
      message: 'Quote created',
      data: quote,
      status_code: 201
    });
  } catch (err) {
    return next(err);
  }
}

async function updateAdminQuote(req, res, next) {
  try {
    const { quoteId } = req.params;
    const { userId, notes, status, items } = req.body;

    const existing = await prisma.quote.findUnique({ where: { id: quoteId }, select: { id: true } });
    if (!existing) {
      return response(res, {
        status: 'error',
        message: 'Quote not found',
        data: null,
        status_code: 404
      });
    }

    if (userId) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        return response(res, {
          status: 'error',
          message: 'User not found',
          data: null,
          status_code: 404
        });
      }
    }

    if (items && items.length > 0) {
      const validationError = await validateQuoteProducts(items);
      if (validationError) {
        return response(res, {
          status: 'error',
          message: validationError,
          data: null,
          status_code: 400
        });
      }
    }

    const quote = await prisma.quote.update({
      where: { id: quoteId },
      data: {
        ...(userId ? { user: { connect: { id: userId } } } : {}),
        ...(notes !== undefined ? { notes } : {}),
        ...(status ? { status } : {}),
        ...(Array.isArray(items) && items.length > 0
          ? {
              items: {
                deleteMany: {},
                create: buildQuoteItemData(items)
              }
            }
          : {})
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: {
          include: {
            product: {
              select: { id: true, name: true, slug: true, imageUrl: true }
            }
          }
        }
      }
    });

    return response(res, {
      status: 'success',
      message: 'Quote updated',
      data: quote,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function sendAdminQuote(req, res, next) {
  try {
    const { quoteId } = req.params;

    const quote = await prisma.quote.findUnique({ where: { id: quoteId } });
    if (!quote) {
      return response(res, {
        status: 'error',
        message: 'Quote not found',
        data: null,
        status_code: 404
      });
    }

    if (quote.status !== 'PENDING') {
      return response(res, {
        status: 'error',
        message: 'Only pending quotes can be sent',
        data: null,
        status_code: 400
      });
    }

    const updated = await prisma.quote.update({
      where: { id: quoteId },
      data: {
        status: 'SENT',
        sentAt: new Date()
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: {
          include: {
            product: {
              select: { id: true, name: true, slug: true, imageUrl: true }
            }
          }
        }
      }
    });

    return response(res, {
      status: 'success',
      message: 'Quote sent',
      data: updated,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listQuotes,
  getQuoteById,
  createQuote,
  acceptQuote,
  rejectQuote,
  listAdminQuotes,
  createAdminQuote,
  updateAdminQuote,
  sendAdminQuote
};
