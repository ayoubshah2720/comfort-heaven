const response = require('../utils/response');
const prisma = require('../db/prisma');
const slugify = require('../utils/slugify');

async function listCollections(req, res, next) {
  try {
    const collections = await prisma.collection.findMany({ where: { isActive: true }, orderBy: { createdAt: 'desc' } });

    return response(res, {
      status: 'success',
      message: 'Collections',
      data: collections,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function createCollection(req, res, next) {
  try {
    const { name, description, imageUrl, isActive } = req.body;
    const slug = slugify(name);

    const existing = await prisma.collection.findUnique({ where: { slug } });
    if (existing) {
      return response(res, {
        status: 'error',
        message: 'Collection slug already exists',
        data: null,
        status_code: 409
      });
    }

    const collection = await prisma.collection.create({ data: { name, slug, description, imageUrl, isActive } });

    return response(res, {
      status: 'success',
      message: 'Collection created',
      data: collection,
      status_code: 201
    });
  } catch (err) {
    return next(err);
  }
}

async function updateCollection(req, res, next) {
  try {
    const { id } = req.params;
    const { name, description, imageUrl, isActive } = req.body;

    const data = { description, imageUrl, isActive };
    if (name) {
      const slug = slugify(name);
      const existing = await prisma.collection.findUnique({ where: { slug } });
      if (existing && existing.id !== id) {
        return response(res, {
          status: 'error',
          message: 'Collection slug already exists',
          data: null,
          status_code: 409
        });
      }
      data.name = name;
      data.slug = slug;
    }

    const collection = await prisma.collection.update({ where: { id }, data });

    return response(res, {
      status: 'success',
      message: 'Collection updated',
      data: collection,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function deleteCollection(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.collection.delete({ where: { id } });

    return response(res, {
      status: 'success',
      message: 'Collection deleted',
      data: null,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { listCollections, createCollection, updateCollection, deleteCollection };
