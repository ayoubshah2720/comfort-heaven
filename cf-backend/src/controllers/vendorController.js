const response = require('../utils/response');
const prisma = require('../db/prisma');
const slugify = require('../utils/slugify');

async function listVendors(req, res, next) {
  try {
    const vendors = await prisma.vendor.findMany({ where: { isActive: true }, orderBy: { createdAt: 'desc' } });

    return response(res, {
      status: 'success',
      message: 'Vendors',
      data: vendors,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function createVendor(req, res, next) {
  try {
    const { name, description, imageUrl, isActive } = req.body;
    const slug = slugify(name);

    const existing = await prisma.vendor.findUnique({ where: { slug } });
    if (existing) {
      return response(res, {
        status: 'error',
        message: 'Vendor slug already exists',
        data: null,
        status_code: 409
      });
    }

    const vendor = await prisma.vendor.create({ data: { name, slug, description, imageUrl, isActive } });

    return response(res, {
      status: 'success',
      message: 'Vendor created',
      data: vendor,
      status_code: 201
    });
  } catch (err) {
    return next(err);
  }
}

async function updateVendor(req, res, next) {
  try {
    const { id } = req.params;
    const { name, description, imageUrl, isActive } = req.body;

    const data = { description, imageUrl, isActive };
    if (name) {
      const slug = slugify(name);
      const existing = await prisma.vendor.findUnique({ where: { slug } });
      if (existing && existing.id !== id) {
        return response(res, {
          status: 'error',
          message: 'Vendor slug already exists',
          data: null,
          status_code: 409
        });
      }
      data.name = name;
      data.slug = slug;
    }

    const vendor = await prisma.vendor.update({ where: { id }, data });

    return response(res, {
      status: 'success',
      message: 'Vendor updated',
      data: vendor,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function deleteVendor(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.vendor.delete({ where: { id } });

    return response(res, {
      status: 'success',
      message: 'Vendor deleted',
      data: null,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { listVendors, createVendor, updateVendor, deleteVendor };
