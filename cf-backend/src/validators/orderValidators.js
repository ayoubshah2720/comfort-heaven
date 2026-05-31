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
    .withMessage('currency must be a 3-letter code'),
  body('addressId').optional().isUUID().withMessage('addressId must be a valid UUID'),
  body('shippingAddress').optional().isObject().withMessage('shippingAddress must be an object'),
  body('shippingAddress.label').optional().trim().notEmpty(),
  body('shippingAddress.address1').optional().trim().notEmpty(),
  body('shippingAddress.city').optional().trim().notEmpty(),
  body('shippingAddress.state').optional().trim().notEmpty(),
  body('shippingAddress.zipCode').optional().trim().notEmpty(),
  body('shippingAddress.phone').optional().trim().notEmpty(),
  body('shippingAddress.company').optional().trim(),
  body('shippingAddress.address2').optional().trim(),
  body('shippingAddress.country').optional().trim()
];

module.exports = { orderAdminUpdateValidation, checkoutValidation };
