const { body } = require('express-validator');

const orderAdminUpdateValidation = [
  body('status')
    .optional()
    .isIn(['PENDING', 'CONFIRMED', 'FULFILLED', 'CANCELLED', 'REFUNDED'])
    .withMessage('Invalid order status'),
  body('notes').optional().isString().withMessage('notes must be a string')
];

const checkoutValidation = [
  body('notes').optional().isString(),
  body('shippingCents')
    .optional()
    .isInt({ min: 0 })
    .withMessage('shippingCents must be a non-negative integer'),
  body('taxCents')
    .optional()
    .isInt({ min: 0 })
    .withMessage('taxCents must be a non-negative integer'),
  body('discountCents')
    .optional()
    .isInt({ min: 0 })
    .withMessage('discountCents must be a non-negative integer'),
  body('currency')
    .optional()
    .trim()
    .notEmpty()
    .isLength({ min: 3, max: 3 })
    .withMessage('currency must be a 3-letter code')
];

module.exports = { orderAdminUpdateValidation, checkoutValidation };
