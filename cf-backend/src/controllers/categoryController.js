const prisma = require('../db/prisma');
const response = require('../utils/response');

async function listCategories(req, res, next) {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        subcategories: { where: { isActive: true } },
        _count: { select: { products: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return response(res, {
      status: 'success',
      message: 'Categories',
      data: categories,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function getCategoryBySlug(req, res, next) {
  try {
    const { slug } = req.params;
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        subcategories: { where: { isActive: true } },
        _count: { select: { products: true } }
      }
    });

    if (!category || !category.isActive) {
      return response(res, {
        status: 'error',
        message: 'Category not found',
        data: null,
        status_code: 404
      });
    }

    return response(res, {
      status: 'success',
      message: 'Category',
      data: category,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function listHeaderCategories(req, res, next) {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true, showInHeader: true },
      select: { id: true, name: true, slug: true },
      orderBy: { headerOrder: 'asc' }
    });
    return response(res, {
      status: 'success',
      message: 'Header categories',
      data: categories,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { listCategories, getCategoryBySlug, listHeaderCategories };
