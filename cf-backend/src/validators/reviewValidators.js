const { body } = require('express-validator');

const reviewCreateValidation = [
  body('productId').trim().notEmpty().withMessage('productId is required'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('rating must be an integer between 1 and 5'),
  body('comment').trim().notEmpty().withMessage('comment is required')
];

module.exports = { reviewCreateValidation };
