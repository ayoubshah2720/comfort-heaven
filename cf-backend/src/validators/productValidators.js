const { body, query } = require('express-validator');

const productCreateValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('categoryId').trim().notEmpty().withMessage('categoryId is required'),
  body('subCategoryId').trim().notEmpty().withMessage('subCategoryId is required'),
  body('brandId').optional().trim().notEmpty().withMessage('brandId cannot be empty'),
  body('vendorId').optional().trim().notEmpty().withMessage('vendorId cannot be empty'),
  body('collectionId').optional().trim().notEmpty().withMessage('collectionId cannot be empty'),
  body('description').optional().isString(),
  body('imageUrl').optional().isString(),
  body('priceCents').optional().isInt({ min: 0 }).withMessage('priceCents must be a non-negative integer'),
  body('isActive').optional().isBoolean()
];

const productUpdateValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('categoryId').optional().trim().notEmpty().withMessage('categoryId cannot be empty'),
  body('subCategoryId').optional().trim().notEmpty().withMessage('subCategoryId cannot be empty'),
  body('brandId').optional().trim().notEmpty().withMessage('brandId cannot be empty'),
  body('vendorId').optional().trim().notEmpty().withMessage('vendorId cannot be empty'),
  body('collectionId').optional().trim().notEmpty().withMessage('collectionId cannot be empty'),
  body('description').optional().isString(),
  body('imageUrl').optional().isString(),
  body('priceCents').optional().isInt({ min: 0 }).withMessage('priceCents must be a non-negative integer'),
  body('isActive').optional().isBoolean()
];

const productImageValidation = [
  body('url').trim().notEmpty().withMessage('Image URL is required'),
  body('altText').optional().isString(),
  body('isCover').optional().isBoolean()
];

const productListQueryValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('page must be an integer >= 1'),
  query('pageSize').optional().isInt({ min: 1, max: 100 }).withMessage('pageSize must be 1-100'),
  query('sortBy').optional().isIn(['createdAt', 'priceCents', 'name']).withMessage('sortBy must be createdAt, priceCents, or name'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('sortOrder must be asc or desc'),
  query('minPrice').optional().isInt({ min: 0 }).withMessage('minPrice must be a non-negative integer'),
  query('maxPrice').optional().isInt({ min: 0 }).withMessage('maxPrice must be a non-negative integer'),
];

module.exports = { productCreateValidation, productUpdateValidation, productImageValidation, productListQueryValidation };
