const response = require('../utils/response');
const prisma = require('../db/prisma');

async function listReviews(req, res, next) {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        status: 'APPROVED'
      },
      include: {
        product: {
          select: { id: true, name: true, slug: true, imageUrl: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return response(res, {
      status: 'success',
      message: 'Reviews',
      data: reviews,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function createReview(req, res, next) {
  try {
    const { productId, rating, comment } = req.body;

    const product = await prisma.product.findUnique({ where: { id: productId }, select: { id: true } });
    if (!product) {
      return response(res, {
        status: 'error',
        message: 'Product not found',
        data: null,
        status_code: 404
      });
    }

    const review = await prisma.review.create({
      data: {
        userId: req.user.id,
        productId,
        rating: Number(rating),
        comment,
        status: 'PENDING'
      },
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
    });

    return response(res, {
      status: 'success',
      message: 'Review submitted',
      data: review,
      status_code: 201
    });
  } catch (err) {
    return next(err);
  }
}

async function listAdminReviews(req, res, next) {
  try {
    const { status, productId } = req.query;

    const reviews = await prisma.review.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(productId ? { productId } : {})
      },
      include: {
        product: {
          select: { id: true, name: true, slug: true, imageUrl: true }
        },
        user: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return response(res, {
      status: 'success',
      message: 'Reviews',
      data: reviews,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function approveReview(req, res, next) {
  try {
    const { reviewId } = req.params;

    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) {
      return response(res, {
        status: 'error',
        message: 'Review not found',
        data: null,
        status_code: 404
      });
    }

    const updated = await prisma.review.update({
      where: { id: reviewId },
      data: { status: 'APPROVED' },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        product: {
          select: { id: true, name: true, slug: true }
        }
      }
    });

    return response(res, {
      status: 'success',
      message: 'Review approved',
      data: updated,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function rejectReview(req, res, next) {
  try {
    const { reviewId } = req.params;

    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) {
      return response(res, {
        status: 'error',
        message: 'Review not found',
        data: null,
        status_code: 404
      });
    }

    const updated = await prisma.review.update({
      where: { id: reviewId },
      data: { status: 'REJECTED' },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        product: {
          select: { id: true, name: true, slug: true }
        }
      }
    });

    return response(res, {
      status: 'success',
      message: 'Review rejected',
      data: updated,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function deleteReview(req, res, next) {
  try {
    const { reviewId } = req.params;

    const existing = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!existing) {
      return response(res, {
        status: 'error',
        message: 'Review not found',
        data: null,
        status_code: 404
      });
    }

    await prisma.review.delete({ where: { id: reviewId } });

    return response(res, {
      status: 'success',
      message: 'Review deleted',
      data: null,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listReviews,
  createReview,
  listAdminReviews,
  approveReview,
  rejectReview,
  deleteReview
};
