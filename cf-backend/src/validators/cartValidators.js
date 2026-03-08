const { body } = require('express-validator');

const cartItemValidation = [
  body('productId').trim().notEmpty().withMessage('productId is required'),
  body('quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('quantity must be a positive integer')
];

const cartItemUpdateValidation = [
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('quantity must be a positive integer')
];

module.exports = { cartItemValidation, cartItemUpdateValidation };
