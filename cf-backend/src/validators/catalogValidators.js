const { body } = require('express-validator');

const entityCreateValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('description').optional().isString(),
  body('imageUrl').optional().isString(),
  body('isActive').optional().isBoolean()
];

const entityUpdateValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('description').optional().isString(),
  body('imageUrl').optional().isString(),
  body('isActive').optional().isBoolean()
];

module.exports = { entityCreateValidation, entityUpdateValidation };
