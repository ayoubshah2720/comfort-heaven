const slugify = require('../utils/slugify');
const response = require('../utils/response');
const prisma = require('../db/prisma');

function withProductRelations(select = true) {
  const include = {
    category: { select: { id: true, name: true, slug: true } },
    subCategory: { select: { id: true, name: true, slug: true } },
    brand: { select: { id: true, name: true, slug: true } },
    vendor: { select: { id: true, name: true, slug: true } },
    collection: { select: { id: true, name: true, slug: true } },
  };

  if (select) {
    include.images = {
      orderBy: { createdAt: 'asc' },
      select: { id: true, url: true, altText: true, isCover: true }
    };
  }

  return include;
}

async function validateRelatedEntities({ categoryId, subCategoryId, brandId, vendorId, collectionId }) {
  if (categoryId) {
    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) {
      return 'Category not found';
    }
  }

  if (subCategoryId) {
    const subCategory = await prisma.subCategory.findUnique({ where: { id: subCategoryId } });
    if (!subCategory) {
      return 'SubCategory not found';
    }
    if (categoryId && subCategory.categoryId !== categoryId) {
      return 'SubCategory does not belong to the selected category';
    }
  }

  if (brandId) {
    const brand = await prisma.brand.findUnique({ where: { id: brandId } });
    if (!brand) {
      return 'Brand not found';
    }
  }

  if (vendorId) {
    const vendor = await prisma.vendor.findUnique({ where: { id: vendorId } });
    if (!vendor) {
      return 'Vendor not found';
    }
  }

  if (collectionId) {
    const collection = await prisma.collection.findUnique({ where: { id: collectionId } });
    if (!collection) {
      return 'Collection not found';
    }
  }

  return null;
}

function buildProductWhere(query, isAdmin) {
  const {
    q,
    categoryId,
    subCategoryId,
    categorySlug,
    subCategorySlug,
    brandId,
    vendorId,
    collectionId
  } = query;

  return {
    ...(isAdmin === false ? { isActive: true } : {}),
    ...(isAdmin === true ? (query.includeInactive === 'true' ? {} : { isActive: true }) : {}),
    ...(categoryId ? { categoryId } : {}),
    ...(subCategoryId ? { subCategoryId } : {}),
    ...(brandId ? { brandId } : {}),
    ...(vendorId ? { vendorId } : {}),
    ...(collectionId ? { collectionId } : {}),
    ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    ...(subCategorySlug ? { subCategory: { slug: subCategorySlug } } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: String(q), mode: 'insensitive' } },
            { description: { contains: String(q), mode: 'insensitive' } }
          ]
        }
      : {})
  };
}

async function listProducts(req, res, next) {
  try {
    const products = await prisma.product.findMany({
      where: buildProductWhere(req.query, false),
      include: withProductRelations(),
      orderBy: { createdAt: 'desc' }
    });

    return response(res, {
      status: 'success',
      message: 'Products',
      data: products,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function listAdminProducts(req, res, next) {
  try {
    const products = await prisma.product.findMany({
      where: buildProductWhere(req.query, true),
      include: withProductRelations(),
      orderBy: { createdAt: 'desc' }
    });

    return response(res, {
      status: 'success',
      message: 'Products',
      data: products,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function getProductById(req, res, next) {
  try {
    const { productId } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: withProductRelations()
    });

    if (!product || !product.isActive) {
      return response(res, {
        status: 'error',
        message: 'Product not found',
        data: null,
        status_code: 404
      });
    }

    return response(res, {
      status: 'success',
      message: 'Product',
      data: product,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function createProduct(req, res, next) {
  try {
    const {
      name,
      categoryId,
      subCategoryId,
      brandId,
      vendorId,
      collectionId,
      description,
      priceCents,
      imageUrl,
      isActive
    } = req.body;

    const validationError = await validateRelatedEntities({
      categoryId,
      subCategoryId,
      brandId,
      vendorId,
      collectionId
    });
    if (validationError) {
      return response(res, {
        status: 'error',
        message: validationError,
        data: null,
        status_code: 404
      });
    }

    const slug = slugify(name);
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      return response(res, {
        status: 'error',
        message: 'Product slug already exists',
        data: null,
        status_code: 409
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        categoryId,
        subCategoryId,
        brandId,
        vendorId,
        collectionId,
        description,
        imageUrl,
        isActive
      }
    });

    return response(res, {
      status: 'success',
      message: 'Product created',
      data: product,
      status_code: 201
    });
  } catch (err) {
    return next(err);
  }
}

async function updateProduct(req, res, next) {
  try {
    const { productId } = req.params;
    const {
      name,
      categoryId,
      subCategoryId,
      brandId,
      vendorId,
      collectionId,
      description,
      priceCents,
      imageUrl,
      isActive
    } = req.body;

    const currentProduct = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        categoryId: true,
        subCategoryId: true,
        brandId: true,
        vendorId: true,
        collectionId: true
      }
    });
    if (!currentProduct) {
      return response(res, {
        status: 'error',
        message: 'Product not found',
        data: null,
        status_code: 404
      });
    }

    const targetCategoryId = categoryId || currentProduct.categoryId;
    const targetSubCategoryId = subCategoryId || currentProduct.subCategoryId;
    const targetBrandId = brandId || currentProduct.brandId;
    const targetVendorId = vendorId || currentProduct.vendorId;
    const targetCollectionId = collectionId || currentProduct.collectionId;

    const validationError = await validateRelatedEntities({
      categoryId: targetCategoryId,
      subCategoryId: targetSubCategoryId,
      brandId: targetBrandId || null,
      vendorId: targetVendorId || null,
      collectionId: targetCollectionId || null
    });
    if (validationError && validationError !== 'SubCategory does not belong to the selected category') {
      return response(res, {
        status: 'error',
        message: validationError,
        data: null,
        status_code: 404
      });
    }
    if (validationError === 'SubCategory does not belong to the selected category') {
      return response(res, {
        status: 'error',
        message: validationError,
        data: null,
        status_code: 400
      });
    }

    const data = {
      name,
      categoryId,
      subCategoryId,
      brandId,
      vendorId,
      collectionId,
      description,
      imageUrl,
      isActive
    };

    if (name) {
      const nextSlug = slugify(name);
      const existingProductWithSlug = await prisma.product.findUnique({ where: { slug: nextSlug } });
      if (existingProductWithSlug && existingProductWithSlug.id !== productId) {
        return response(res, {
          status: 'error',
          message: 'Product slug already exists',
          data: null,
          status_code: 409
        });
      }
      data.slug = nextSlug;
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data
    });

    return response(res, {
      status: 'success',
      message: 'Product updated',
      data: product,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const { productId } = req.params;
    await prisma.product.delete({ where: { id: productId } });

    return response(res, {
      status: 'success',
      message: 'Product deleted',
      data: null,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function addProductImage(req, res, next) {
  try {
    const { productId } = req.params;
    const { url, altText, isCover } = req.body;

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return response(res, {
        status: 'error',
        message: 'Product not found',
        data: null,
        status_code: 404
      });
    }

    const image = await prisma.productImage.create({
      data: {
        productId,
        url,
        altText,
        isCover: Boolean(isCover)
      }
    });

    return response(res, {
      status: 'success',
      message: 'Product image added',
      data: image,
      status_code: 201
    });
  } catch (err) {
    return next(err);
  }
}

async function removeProductImage(req, res, next) {
  try {
    const { productId, imageId } = req.params;

    const image = await prisma.productImage.findUnique({ where: { id: imageId } });
    if (!image || image.productId !== productId) {
      return response(res, {
        status: 'error',
        message: 'Product image not found',
        data: null,
        status_code: 404
      });
    }

    await prisma.productImage.delete({ where: { id: imageId } });

    return response(res, {
      status: 'success',
      message: 'Product image removed',
      data: null,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function search(req, res, next) {
  try {
    const { q } = req.query;
    if (!q || String(q).trim() === '') {
      return response(res, {
        status: 'error',
        message: 'Search query is required',
        data: null,
        status_code: 400
      });
    }

    const keyword = String(q).trim();
    const where = {
      OR: [
        { name: { contains: keyword, mode: 'insensitive' } },
        { description: { contains: keyword, mode: 'insensitive' } }
      ]
    };

    const [products, categories, collections, brands, vendors] = await Promise.all([
      prisma.product.findMany({ where, include: withProductRelations() }),
      prisma.category.findMany({ where: { name: { contains: keyword, mode: 'insensitive' }, isActive: true } }),
      prisma.collection.findMany({ where: { name: { contains: keyword, mode: 'insensitive' }, isActive: true } }),
      prisma.brand.findMany({ where: { name: { contains: keyword, mode: 'insensitive' }, isActive: true } }),
      prisma.vendor.findMany({ where: { name: { contains: keyword, mode: 'insensitive' }, isActive: true } })
    ]);

    return response(res, {
      status: 'success',
      message: 'Search results',
      data: { products, categories, collections, brands, vendors },
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listProducts,
  listAdminProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductImage,
  removeProductImage,
  search
};
