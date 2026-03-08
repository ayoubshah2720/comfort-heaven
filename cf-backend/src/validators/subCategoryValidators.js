const { body } = require('express-validator');

const subCategoryCreateValidation = [
  body('categoryId').notEmpty().withMessage('categoryId is required'),
  body('name').trim().notEmpty().withMessage('Name is required')
];

const subCategoryUpdateValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('description').optional().isString(),
  body('imageUrl').optional().isString(),
  body('isActive').optional().isBoolean()
];

module.exports = { subCategoryCreateValidation, subCategoryUpdateValidation };
