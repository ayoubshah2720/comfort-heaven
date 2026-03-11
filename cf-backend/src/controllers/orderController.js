const response = require('../utils/response');
const prisma = require('../db/prisma');

function buildOrderIncludeForPublic() {
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

function buildOrderIncludeForAdmin() {
  return {
    user: {
      select: {
        id: true,
        name: true,
        email: true
      }
    },
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

function normalizeMoney(value = 0) {
  return Number.isFinite(Number(value)) ? Number(value) : 0;
}

function roundMoney(value) {
  return Math.max(0, Math.round(value));
}

function calculateTotals(items, taxCents = 0, shippingCents = 0, discountCents = 0) {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPriceCents, 0);
  const total = subtotal + taxCents + shippingCents - discountCents;
  return {
    subtotalCents: subtotal,
    taxCents,
    shippingCents,
    discountCents,
    totalCents: roundMoney(total)
  };
}

function validateProductPrice(product) {
  if (!product || !product.isActive) {
    return false;
  }
  return true;
}

async function listOrders(req, res, next) {
  try {
    const { status } = req.query;

    const orders = await prisma.order.findMany({
      where: {
        userId: req.user.id,
        ...(status ? { status } : {})
      },
      include: buildOrderIncludeForPublic(),
      orderBy: { createdAt: 'desc' }
    });

    return response(res, {
      status: 'success',
      message: 'Orders',
      data: orders,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function getOrderById(req, res, next) {
  try {
    const { orderId } = req.params;

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: req.user.id
      },
      include: buildOrderIncludeForPublic()
    });

    if (!order) {
      return response(res, {
        status: 'error',
        message: 'Order not found',
        data: null,
        status_code: 404
      });
    }

    return response(res, {
      status: 'success',
      message: 'Order',
      data: order,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function checkout(req, res, next) {
  try {
    const {
      notes,
      shippingCents = 0,
      taxCents = 0,
      discountCents = 0,
      currency = 'USD',
      addressId,
      shippingAddress
    } = req.body || {};

    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: { items: { include: { product: { select: { id: true, name: true, isActive: true, priceCents: true } } } } }
    });

    if (!cart || cart.items.length === 0) {
      return response(res, {
        status: 'error',
        message: 'Cart is empty',
        data: null,
        status_code: 400
      });
    }

    const invalidItem = cart.items.find((item) => !validateProductPrice(item.product));
    if (invalidItem) {
      return response(res, {
        status: 'error',
        message: `Product is unavailable: ${invalidItem.product.id}`,
        data: null,
        status_code: 400
      });
    }

    const normalizedTax = roundMoney(normalizeMoney(taxCents));
    const normalizedShipping = roundMoney(normalizeMoney(shippingCents));
    const normalizedDiscount = roundMoney(normalizeMoney(discountCents));
    const totals = calculateTotals(
      cart.items,
      normalizedTax,
      normalizedShipping,
      normalizedDiscount
    );

    let resolvedAddress = null;
    if (addressId) {
      const saved = await prisma.address.findFirst({
        where: { id: addressId, userId: req.user.id }
      });
      if (!saved) {
        return response(res, {
          status: 'error',
          message: 'Address not found',
          data: null,
          status_code: 404
        });
      }
      resolvedAddress = saved;
    } else if (shippingAddress) {
      resolvedAddress = shippingAddress;
    }

    const cartItemData = cart.items.map((item) => ({
      productId: item.productId,
      productName: item.product.name,
      quantity: item.quantity,
      unitPriceCents: item.unitPriceCents || item.product.priceCents || 0,
      totalCents: item.quantity * (item.unitPriceCents || item.product.priceCents || 0)
    }));

    const order = await prisma.$transaction(async (tx) => {
      const sequence = `ORD-${Date.now()}`;
      const orderNumber = `${sequence}-${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`;

      const createdOrder = await tx.order.create({
        data: {
          userId: req.user.id,
          orderNumber,
          notes: notes || null,
          subtotalCents: totals.subtotalCents,
          taxCents: totals.taxCents,
          shippingCents: totals.shippingCents,
          discountCents: totals.discountCents,
          totalCents: totals.totalCents,
          currency: (currency || 'USD').toUpperCase(),
          status: 'PENDING',
          ...(resolvedAddress ? {
            shippingLabel: resolvedAddress.label || null,
            shippingCompany: resolvedAddress.company || null,
            shippingAddress1: resolvedAddress.address1 || null,
            shippingAddress2: resolvedAddress.address2 || null,
            shippingCity: resolvedAddress.city || null,
            shippingState: resolvedAddress.state || null,
            shippingZipCode: resolvedAddress.zipCode || null,
            shippingCountry: resolvedAddress.country || null,
            shippingPhone: resolvedAddress.phone || null,
          } : {}),
          items: {
            create: cartItemData
          }
        },
        include: buildOrderIncludeForPublic()
      });

      await tx.cartItem.deleteMany({
        where: { cartId: cart.id }
      });

      return createdOrder;
    });

    return response(res, {
      status: 'success',
      message: 'Checkout completed',
      data: order,
      status_code: 201
    });
  } catch (err) {
    return next(err);
  }
}

async function listAdminOrders(req, res, next) {
  try {
    const { status, userId } = req.query;

    const orders = await prisma.order.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(userId ? { userId } : {})
      },
      include: buildOrderIncludeForAdmin(),
      orderBy: { createdAt: 'desc' }
    });

    return response(res, {
      status: 'success',
      message: 'Orders',
      data: orders,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function getAdminOrderById(req, res, next) {
  try {
    const { orderId } = req.params;
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: buildOrderIncludeForAdmin()
    });

    if (!order) {
      return response(res, {
        status: 'error',
        message: 'Order not found',
        data: null,
        status_code: 404
      });
    }

    return response(res, {
      status: 'success',
      message: 'Order',
      data: order,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function updateOrderAdmin(req, res, next) {
  try {
    const { orderId } = req.params;
    const { status, notes } = req.body;

    const payload = {};
    if (status) {
      payload.status = status;
    }
    if (notes !== undefined) {
      payload.notes = notes || null;
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return response(res, {
        status: 'error',
        message: 'Order not found',
        data: null,
        status_code: 404
      });
    }

    if (!status && notes === undefined) {
      return response(res, {
        status: 'error',
        message: 'Nothing to update',
        data: null,
        status_code: 400
      });
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: payload,
      include: buildOrderIncludeForAdmin()
    });

    return response(res, {
      status: 'success',
      message: 'Order updated',
      data: updated,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function markAsFulfilled(req, res, next) {
  try {
    const { orderId } = req.params;
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return response(res, {
        status: 'error',
        message: 'Order not found',
        data: null,
        status_code: 404
      });
    }

    if (order.status === 'FULFILLED') {
      return response(res, {
        status: 'error',
        message: 'Order is already fulfilled',
        data: null,
        status_code: 400
      });
    }
    if (order.status === 'CANCELLED' || order.status === 'REFUNDED') {
      return response(res, {
        status: 'error',
        message: 'Order cannot be fulfilled in current status',
        data: null,
        status_code: 400
      });
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'FULFILLED',
        fulfilledAt: new Date()
      },
      include: buildOrderIncludeForAdmin()
    });

    return response(res, {
      status: 'success',
      message: 'Order fulfilled',
      data: updated,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function markAsRefunded(req, res, next) {
  try {
    const { orderId } = req.params;
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return response(res, {
        status: 'error',
        message: 'Order not found',
        data: null,
        status_code: 404
      });
    }

    if (order.status === 'REFUNDED') {
      return response(res, {
        status: 'error',
        message: 'Order is already refunded',
        data: null,
        status_code: 400
      });
    }

    const refundedAmountCents = order.totalCents;

    const updated = await prisma.$transaction(async (tx) => tx.order.update({
      where: { id: orderId },
      data: {
        status: 'REFUNDED',
        refundedAmountCents,
        refundedAt: new Date(),
        paidAt: null
      },
      include: buildOrderIncludeForAdmin()
    }));

    return response(res, {
      status: 'success',
      message: 'Order refunded',
      data: updated,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function cancelOrder(req, res, next) {
  try {
    const { orderId } = req.params;
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return response(res, {
        status: 'error',
        message: 'Order not found',
        data: null,
        status_code: 404
      });
    }

    if (order.status === 'CANCELLED') {
      return response(res, {
        status: 'error',
        message: 'Order is already cancelled',
        data: null,
        status_code: 400
      });
    }

    if (order.status === 'FULFILLED' || order.status === 'REFUNDED') {
      return response(res, {
        status: 'error',
        message: 'Order cannot be cancelled in current status',
        data: null,
        status_code: 400
      });
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date()
      },
      include: buildOrderIncludeForAdmin()
    });

    return response(res, {
      status: 'success',
      message: 'Order cancelled',
      data: updated,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listOrders,
  getOrderById,
  checkout,
  listAdminOrders,
  getAdminOrderById,
  updateOrderAdmin,
  markAsFulfilled,
  markAsRefunded,
  cancelOrder
};
