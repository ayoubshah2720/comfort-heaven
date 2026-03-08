const { body } = require('express-validator');

const quoteCreateValidation = [
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.productId').trim().notEmpty().withMessage('productId is required for each item'),
  body('items.*.quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('quantity must be a positive integer')
];

const quoteAdminCreateValidation = [
  body('userId').trim().notEmpty().withMessage('userId is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.productId').trim().notEmpty().withMessage('productId is required for each item'),
  body('items.*.quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('quantity must be a positive integer'),
  body('status')
    .optional()
    .isIn(['PENDING', 'ACCEPTED', 'REJECTED', 'SENT'])
    .withMessage('Invalid quote status')
];

const quoteAdminUpdateValidation = [
  body('userId').optional().trim().notEmpty().withMessage('userId cannot be empty'),
  body('status').optional().isIn(['PENDING', 'ACCEPTED', 'REJECTED', 'SENT']).withMessage('Invalid quote status'),
  body('items').optional().isArray({ min: 1 }).withMessage('At least one item is required when replacing items'),
  body('items.*.productId').optional().trim().notEmpty().withMessage('productId is required for each item'),
  body('items.*.quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('quantity must be a positive integer')
];

module.exports = {
  quoteCreateValidation,
  quoteAdminCreateValidation,
  quoteAdminUpdateValidation
};
