const response = require('../utils/response');
const prisma = require('../db/prisma');

function buildCartProductSelect() {
  return {
    id: true,
    name: true,
    slug: true,
    imageUrl: true,
    priceCents: true,
    isActive: true
  };
}

function normalizeCart(cart) {
  if (!cart) {
    return { id: null, items: [], totals: { subtotalCents: 0, itemsCount: 0 } };
  }

  const subtotalCents = cart.items.reduce((sum, item) => {
    const itemTotal = item.quantity * item.unitPriceCents;
    return sum + (Number.isFinite(itemTotal) ? itemTotal : 0);
  }, 0);

  const items = cart.items.map((item) => ({
    id: item.id,
    quantity: item.quantity,
    unitPriceCents: item.unitPriceCents,
    totalCents: item.quantity * item.unitPriceCents,
    product: item.product
  }));

  return {
    id: cart.id,
    items,
    totals: {
      itemsCount: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotalCents
    }
  };
}

async function getOrCreateCart(userId) {
  const existing = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: { select: buildCartProductSelect() } } } }
  });

  if (existing) {
    return existing;
  }

  return prisma.cart.create({
    data: { userId },
    include: { items: { include: { product: { select: buildCartProductSelect() } } } }
  });
}

async function getCart(req, res, next) {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: { items: { include: { product: { select: buildCartProductSelect() } } } }
    });

    return response(res, {
      status: 'success',
      message: 'Cart',
      data: normalizeCart(cart),
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function addCartItem(req, res, next) {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user.id;

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || !product.isActive) {
      return response(res, {
        status: 'error',
        message: 'Product not found',
        data: null,
        status_code: 404
      });
    }

    const cart = await getOrCreateCart(userId);
    const qty = Number(quantity || 1);

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId
      }
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + qty,
          unitPriceCents: product.priceCents
        },
        include: {
          product: {
            select: buildCartProductSelect()
          }
        }
      });

      const updatedCart = await prisma.cart.findUnique({
        where: { id: cart.id },
        include: { items: { include: { product: { select: buildCartProductSelect() } } } }
      });

      return response(res, {
        status: 'success',
        message: 'Cart item updated',
        data: normalizeCart(updatedCart),
        status_code: 200
      });
    }

    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity: qty,
        unitPriceCents: product.priceCents
      }
    });

    const refreshedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: { include: { product: { select: buildCartProductSelect() } } } }
    });

    return response(res, {
      status: 'success',
      message: 'Cart item added',
      data: normalizeCart(refreshedCart),
      status_code: 201
    });
  } catch (err) {
    return next(err);
  }
}

async function updateCartItem(req, res, next) {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const nextQty = Number(quantity);

    const item = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: { userId: req.user.id }
      },
      include: {
        cart: true
      }
    });

    if (!item) {
      return response(res, {
        status: 'error',
        message: 'Cart item not found',
        data: null,
        status_code: 404
      });
    }

      await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity: nextQty }
      });

    const cart = await prisma.cart.findUnique({
      where: { id: item.cartId },
      include: { items: { include: { product: { select: buildCartProductSelect() } } } }
    });

    return response(res, {
      status: 'success',
      message: 'Cart item updated',
      data: normalizeCart(cart),
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function removeCartItem(req, res, next) {
  try {
    const { itemId } = req.params;

    const item = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: { userId: req.user.id }
      }
    });

    if (!item) {
      return response(res, {
        status: 'error',
        message: 'Cart item not found',
        data: null,
        status_code: 404
      });
    }

    await prisma.cartItem.delete({ where: { id: itemId } });

    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: { items: { include: { product: { select: buildCartProductSelect() } } } }
    });

    return response(res, {
      status: 'success',
      message: 'Cart item removed',
      data: normalizeCart(cart),
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem
};
