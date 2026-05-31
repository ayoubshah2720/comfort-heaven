const slugify = require('../utils/slugify');
const response = require('../utils/response');
const prisma = require('../db/prisma');
const { uploadBufferToCloudinary, destroyCloudinaryImage } = require('../utils/cloudinaryAssets');

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

function parseBooleanInput(value, fallback = false) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    return value === 'true' || value === '1';
  }
  return fallback;
}

async function syncProductDefaultImage(productId) {
  const coverImage = await prisma.productImage.findFirst({
    where: { productId, isCover: true },
    orderBy: { createdAt: 'desc' },
    select: { url: true }
  });

  if (coverImage) {
    await prisma.product.update({
      where: { id: productId },
      data: { imageUrl: coverImage.url }
    });
    return;
  }

  const fallbackImage = await prisma.productImage.findFirst({
    where: { productId },
    orderBy: { createdAt: 'asc' },
    select: { url: true }
  });

  await prisma.product.update({
    where: { id: productId },
    data: { imageUrl: fallbackImage ? fallbackImage.url : null }
  });
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
    collectionId,
    minPrice,
    maxPrice
  } = query;

  const priceCentsFilter = {};
  if (minPrice !== undefined) priceCentsFilter.gte = Number(minPrice);
  if (maxPrice !== undefined) priceCentsFilter.lte = Number(maxPrice);

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
    ...(Object.keys(priceCentsFilter).length > 0 ? { priceCents: priceCentsFilter } : {}),
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

async function listNewArrivals(req, res, next) {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true, isNewArrival: true },
      include: withProductRelations(),
      orderBy: { createdAt: 'desc' }
    });
    return response(res, {
      status: 'success',
      message: 'New arrivals',
      data: products,
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function listProducts(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(req.query.pageSize) || 12));
    const sortBy = ['createdAt', 'priceCents', 'name'].includes(req.query.sortBy) ? req.query.sortBy : 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 'asc' : 'desc';
    const skip = (page - 1) * pageSize;
    const where = buildProductWhere(req.query, false);

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: withProductRelations(),
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: pageSize
      }),
      prisma.product.count({ where })
    ]);

    return response(res, {
      status: 'success',
      message: 'Products',
      data: {
        products,
        pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) }
      },
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function listAdminProducts(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(req.query.pageSize) || 12));
    const sortBy = ['createdAt', 'priceCents', 'name'].includes(req.query.sortBy) ? req.query.sortBy : 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 'asc' : 'desc';
    const skip = (page - 1) * pageSize;
    const where = buildProductWhere(req.query, true);

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: withProductRelations(),
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: pageSize
      }),
      prisma.product.count({ where })
    ]);

    return response(res, {
      status: 'success',
      message: 'Products',
      data: {
        products,
        pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) }
      },
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

    const reviewAgg = await prisma.review.aggregate({
      where: { productId, status: 'APPROVED' },
      _avg: { rating: true },
      _count: { rating: true },
    });

    return response(res, {
      status: 'success',
      message: 'Product',
      data: {
        ...product,
        reviewSummary: {
          averageRating: reviewAgg._avg.rating || 0,
          reviewCount: reviewAgg._count.rating,
        },
      },
      status_code: 200
    });
  } catch (err) {
    return next(err);
  }
}

async function adminGetProductById(req, res, next) {
  try {
    const { productId } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: withProductRelations()
    });

    if (!product) {
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
      isActive,
      isNewArrival,
      comparePriceCents,
      longDescription,
      productDetails,
      dimensions,
      careAndCleaning,
      specifications,
      tags
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
        priceCents,
        imageUrl,
        isActive,
        isNewArrival,
        comparePriceCents,
        longDescription,
        productDetails,
        dimensions,
        careAndCleaning,
        specifications,
        tags
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
      isActive,
      isNewArrival,
      comparePriceCents,
      longDescription,
      productDetails,
      dimensions,
      careAndCleaning,
      specifications,
      tags
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
      priceCents,
      imageUrl,
      isActive,
      isNewArrival,
      comparePriceCents,
      longDescription,
      productDetails,
      dimensions,
      careAndCleaning,
      specifications,
      tags
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

    const productImages = await prisma.productImage.findMany({
      where: { productId },
      select: { publicId: true }
    });

    await Promise.all(
      productImages
        .map((image) => image.publicId)
        .filter(Boolean)
        .map((publicId) => destroyCloudinaryImage(publicId))
    );

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
    const { url, publicId, altText, isCover, syncDefault } = req.body;

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return response(res, {
        status: 'error',
        message: 'Product not found',
        data: null,
        status_code: 404
      });
    }

    const shouldBeCover = parseBooleanInput(isCover);
    const shouldSyncDefault = parseBooleanInput(syncDefault) || shouldBeCover || !product.imageUrl;

    const image = await prisma.$transaction(async (tx) => {
      if (shouldBeCover) {
        await tx.productImage.updateMany({
          where: { productId, isCover: true },
          data: { isCover: false }
        });
      }

      const createdImage = await tx.productImage.create({
        data: {
          productId,
          url,
          publicId: publicId || null,
          altText,
          isCover: shouldBeCover
        }
      });

      if (shouldSyncDefault) {
        await tx.product.update({
          where: { id: productId },
          data: { imageUrl: url }
        });
      }

      return createdImage;
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

async function uploadProductImage(req, res, next) {
  try {
    const { productId } = req.params;
    const { altText, isCover, syncDefault } = req.body;

    if (!req.file) {
      return response(res, {
        status: 'error',
        message: 'Image file is required',
        data: null,
        status_code: 400
      });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return response(res, {
        status: 'error',
        message: 'Product not found',
        data: null,
        status_code: 404
      });
    }

    const uploadedAsset = await uploadBufferToCloudinary(req.file.buffer, {
      folder: `products/${productId}`
    });

    req.body = {
      ...req.body,
      url: uploadedAsset.secure_url,
      publicId: uploadedAsset.public_id,
      altText,
      isCover,
      syncDefault
    };

    return addProductImage(req, res, next);
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

    if (image.publicId) {
      await destroyCloudinaryImage(image.publicId);
    }

    await prisma.productImage.delete({ where: { id: imageId } });
    await syncProductDefaultImage(productId);

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
  listNewArrivals,
  listAdminProducts,
  getProductById,
  adminGetProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductImage,
  uploadProductImage,
  removeProductImage,
  search
};
