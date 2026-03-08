const response = require('../utils/response');
const prisma = require('../db/prisma');

function buildInvoiceInclude() {
  return {
    items: {
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            imageUrl: true
          }
        }
      }
    }
  };
}

async function listInvoices(req, res, next) {
  try {
    const { status } = req.query;

    const invoices = await prisma.invoice.findMany({
      where: {
        userId: req.user.id,
        ...(status ? { status } : {})
      },
      include: buildInvoiceInclude(),
      orderBy: { createdAt: 'desc' }
    });

    return response(res, {
      status: 'success',
      message: 'Invoices',
      data: invoices,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function getInvoiceById(req, res, next) {
  try {
    const { invoiceId } = req.params;

    const invoice = await prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        userId: req.user.id
      },
      include: buildInvoiceInclude()
    });

    if (!invoice) {
      return response(res, {
        status: 'error',
        message: 'Invoice not found',
        data: null,
        status_code: 404
      });
    }

    return response(res, {
      status: 'success',
      message: 'Invoice',
      data: invoice,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listInvoices,
  getInvoiceById
};
