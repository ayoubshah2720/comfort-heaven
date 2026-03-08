const response = require('../utils/response');
const prisma = require('../db/prisma');
const slugify = require('../utils/slugify');

async function listBrands(req, res, next) {
  try {
    const brands = await prisma.brand.findMany({ where: { isActive: true }, orderBy: { createdAt: 'desc' } });

    return response(res, {
      status: 'success',
      message: 'Brands',
      data: brands,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function createBrand(req, res, next) {
  try {
    const { name, description, imageUrl, isActive } = req.body;
    const slug = slugify(name);

    const existing = await prisma.brand.findUnique({ where: { slug } });
    if (existing) {
      return response(res, {
        status: 'error',
        message: 'Brand slug already exists',
        data: null,
        status_code: 409
      });
    }

    const brand = await prisma.brand.create({ data: { name, slug, description, imageUrl, isActive } });

    return response(res, {
      status: 'success',
      message: 'Brand created',
      data: brand,
      status_code: 201
    });
  } catch (err) {
    return next(err);
  }
}

async function updateBrand(req, res, next) {
  try {
    const { id } = req.params;
    const { name, description, imageUrl, isActive } = req.body;

    const data = { description, imageUrl, isActive };
    if (name) {
      const slug = slugify(name);
      const existing = await prisma.brand.findUnique({ where: { slug } });
      if (existing && existing.id !== id) {
        return response(res, {
          status: 'error',
          message: 'Brand slug already exists',
          data: null,
          status_code: 409
        });
      }
      data.name = name;
      data.slug = slug;
    }

    const brand = await prisma.brand.update({ where: { id }, data });

    return response(res, {
      status: 'success',
      message: 'Brand updated',
      data: brand,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function deleteBrand(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.brand.delete({ where: { id } });

    return response(res, {
      status: 'success',
      message: 'Brand deleted',
      data: null,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { listBrands, createBrand, updateBrand, deleteBrand };
