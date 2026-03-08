const { body } = require('express-validator');

const categoryCreateValidation = [
  body('name').trim().notEmpty().withMessage('Name is required')
];

const categoryUpdateValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('description').optional().isString(),
  body('imageUrl').optional().isString(),
  body('isActive').optional().isBoolean()
];

module.exports = { categoryCreateValidation, categoryUpdateValidation };
