const { body } = require('express-validator');

const categoryCreateValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('showInHeader').optional().isBoolean(),
  body('headerOrder').optional().isInt({ min: 0 })
];

const categoryUpdateValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('description').optional().isString(),
  body('imageUrl').optional().isString(),
  body('isActive').optional().isBoolean(),
  body('showInHeader').optional().isBoolean(),
  body('headerOrder').optional().isInt({ min: 0 })
];

module.exports = { categoryCreateValidation, categoryUpdateValidation };
