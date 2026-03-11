const response = require('../utils/response');
const prisma = require('../db/prisma');

function buildWishlistProductSelect() {
  return {
    id: true,
    name: true,
    slug: true,
    imageUrl: true,
    priceCents: true,
    isActive: true,
  };
}

async function fetchUserWishlist(userId) {
  return prisma.wishlistItem.findMany({
    where: { userId },
    include: { product: { select: buildWishlistProductSelect() } },
    orderBy: { createdAt: 'desc' },
  });
}

async function getWishlist(req, res, next) {
  try {
    const items = await fetchUserWishlist(req.user.id);

    return response(res, {
      status: 'success',
      message: 'Wishlist',
      data: items,
      status_code: 200,
    });
  } catch (err) {
    return next(err);
  }
}

async function toggleWishlistItem(req, res, next) {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || !product.isActive) {
      return response(res, {
        status: 'error',
        message: 'Product not found',
        data: null,
        status_code: 404,
      });
    }

    const existing = await prisma.wishlistItem.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    let action;
    if (existing) {
      await prisma.wishlistItem.delete({ where: { id: existing.id } });
      action = 'removed';
    } else {
      await prisma.wishlistItem.create({ data: { userId, productId } });
      action = 'added';
    }

    const items = await fetchUserWishlist(userId);

    return response(res, {
      status: 'success',
      message: action === 'added' ? 'Added to wishlist' : 'Removed from wishlist',
      data: { action, items },
      status_code: 200,
    });
  } catch (err) {
    return next(err);
  }
}

async function removeWishlistItem(req, res, next) {
  try {
    const { itemId } = req.params;
    const userId = req.user.id;

    const item = await prisma.wishlistItem.findFirst({
      where: { id: itemId, userId },
    });

    if (!item) {
      return response(res, {
        status: 'error',
        message: 'Wishlist item not found',
        data: null,
        status_code: 404,
      });
    }

    await prisma.wishlistItem.delete({ where: { id: itemId } });

    const items = await fetchUserWishlist(userId);

    return response(res, {
      status: 'success',
      message: 'Removed from wishlist',
      data: items,
      status_code: 200,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { getWishlist, toggleWishlistItem, removeWishlistItem };
