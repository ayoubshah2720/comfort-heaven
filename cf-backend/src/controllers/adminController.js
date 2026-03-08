const prisma = require('../db/prisma');
const response = require('../utils/response');
const slugify = require('../utils/slugify');

async function createCategory(req, res, next) {
  try {
    const { name, description, imageUrl, isActive } = req.body;
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
      data: { name, slug, description, imageUrl, isActive }
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
    const { name, description, imageUrl, isActive } = req.body;

    const data = { description, imageUrl, isActive };
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

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  listUsers,
  deactivateUser
};
