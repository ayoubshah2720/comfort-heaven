const prisma = require('../db/prisma');
const response = require('../utils/response');
const slugify = require('../utils/slugify');

async function createCategory(req, res, next) {
  try {
    const { name, description, imageUrl, isActive, showInHeader, headerOrder } = req.body;
    const slug = slugify(name);

    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      return response(res, {
        status: 'error',
        message: 'Category slug already exists',
        data: null,
        status_code: 409
      });
    }

    const category = await prisma.category.create({
      data: { name, slug, description, imageUrl, isActive, showInHeader, headerOrder }
    });

    return response(res, {
      status: 'success',
      message: 'Category created',
      data: category,
      status_code: 201
    });
  } catch (err) {
    return next(err);
  }
}

async function updateCategory(req, res, next) {
  try {
    const { id } = req.params;
    const { name, description, imageUrl, isActive, showInHeader, headerOrder } = req.body;

    const data = { description, imageUrl, isActive, showInHeader, headerOrder };
    if (name) {
      data.name = name;
      data.slug = slugify(name);
    }

    const category = await prisma.category.update({
      where: { id },
      data
    });

    return response(res, {
      status: 'success',
      message: 'Category updated',
      data: category,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function deleteCategory(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.category.delete({ where: { id } });

    return response(res, {
      status: 'success',
      message: 'Category deleted',
      data: null,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function createSubCategory(req, res, next) {
  try {
    const { categoryId, name, description, imageUrl, isActive } = req.body;
    const slug = slugify(name);

    const existing = await prisma.subCategory.findUnique({ where: { slug } });
    if (existing) {
      return response(res, {
        status: 'error',
        message: 'SubCategory slug already exists',
        data: null,
        status_code: 409
      });
    }

    const subcategory = await prisma.subCategory.create({
      data: { categoryId, name, slug, description, imageUrl, isActive }
    });

    return response(res, {
      status: 'success',
      message: 'SubCategory created',
      data: subcategory,
      status_code: 201
    });
  } catch (err) {
    return next(err);
  }
}

async function updateSubCategory(req, res, next) {
  try {
    const { id } = req.params;
    const { name, description, imageUrl, isActive } = req.body;

    const data = { description, imageUrl, isActive };
    if (name) {
      data.name = name;
      data.slug = slugify(name);
    }

    const subcategory = await prisma.subCategory.update({
      where: { id },
      data
    });

    return response(res, {
      status: 'success',
      message: 'SubCategory updated',
      data: subcategory,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function deleteSubCategory(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.subCategory.delete({ where: { id } });

    return response(res, {
      status: 'success',
      message: 'SubCategory deleted',
      data: null,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function listUsers(req, res, next) {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true }
    });

    return response(res, {
      status: 'success',
      message: 'Users',
      data: users,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function deactivateUser(req, res, next) {
  try {
    const { id } = req.params;
    const user = await prisma.user.update({
      where: { id },
      data: { isActive: false }
    });

    return response(res, {
      status: 'success',
      message: 'User deactivated',
      data: { id: user.id, isActive: user.isActive },
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function reactivateUser(req, res, next) {
  try {
    const { id } = req.params;
    const user = await prisma.user.update({
      where: { id },
      data: { isActive: true }
    });

    return response(res, {
      status: 'success',
      message: 'User reactivated',
      data: { id: user.id, isActive: user.isActive },
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function changeUserRole(req, res, next) {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['USER', 'ADMIN'].includes(role)) {
      return response(res, {
        status: 'error',
        message: 'Invalid role. Must be USER or ADMIN',
        data: null,
        status_code: 400
      });
    }

    if (req.user.id === id) {
      return response(res, {
        status: 'error',
        message: 'Cannot change your own role',
        data: null,
        status_code: 400
      });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role }
    });

    return response(res, {
      status: 'success',
      message: 'User role updated',
      data: { id: user.id, role: user.role },
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function getDashboardStats(req, res, next) {
  try {
    const [userCount, productCount, categoryCount, orderCount] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.category.count(),
      prisma.order.count()
    ]);

    return response(res, {
      status: 'success',
      message: 'Dashboard stats',
      data: { userCount, productCount, categoryCount, orderCount },
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function getDashboardOverview(req, res, next) {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    function fillDays(rows) {
      const map = {};
      for (const r of rows) map[r.date] = r.count;
      const result = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(sevenDaysAgo);
        d.setDate(d.getDate() + i);
        const key = d.toISOString().slice(0, 10);
        result.push({ date: key, count: map[key] || 0 });
      }
      return result;
    }

    const [
      usersByDay,
      productsByDay,
      categoriesByDay,
      recentUsers,
      recentProducts,
      recentCategories
    ] = await Promise.all([
      prisma.$queryRaw`
        SELECT DATE("createdAt")::text AS date, CAST(COUNT(*) AS INTEGER) AS count
        FROM "User"
        WHERE "createdAt" >= ${sevenDaysAgo}
        GROUP BY DATE("createdAt")
        ORDER BY date
      `,
      prisma.$queryRaw`
        SELECT DATE("createdAt")::text AS date, CAST(COUNT(*) AS INTEGER) AS count
        FROM "Product"
        WHERE "createdAt" >= ${sevenDaysAgo}
        GROUP BY DATE("createdAt")
        ORDER BY date
      `,
      prisma.$queryRaw`
        SELECT DATE("createdAt")::text AS date, CAST(COUNT(*) AS INTEGER) AS count
        FROM "Category"
        WHERE "createdAt" >= ${sevenDaysAgo}
        GROUP BY DATE("createdAt")
        ORDER BY date
      `,
      prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),
      prisma.product.findMany({
        select: {
          id: true, name: true, slug: true, priceCents: true, isActive: true, createdAt: true,
          category: { select: { name: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),
      prisma.category.findMany({
        select: {
          id: true, name: true, slug: true, isActive: true, createdAt: true,
          _count: { select: { products: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      })
    ]);

    return response(res, {
      status: 'success',
      message: 'Dashboard overview',
      data: {
        charts: {
          users: fillDays(usersByDay),
          products: fillDays(productsByDay),
          categories: fillDays(categoriesByDay)
        },
        tables: {
          users: recentUsers,
          products: recentProducts,
          categories: recentCategories
        }
      },
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  listUsers,
  deactivateUser,
  reactivateUser,
  changeUserRole,
  getDashboardStats,
  getDashboardOverview
};
