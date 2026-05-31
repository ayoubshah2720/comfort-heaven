const { body } = require('express-validator');

const wishlistItemValidation = [
  body('productId').trim().notEmpty().withMessage('productId is required'),
];

module.exports = { wishlistItemValidation };
