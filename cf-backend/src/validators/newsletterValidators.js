const { body } = require('express-validator');

const newsletterSubscribeValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(),
];

module.exports = { newsletterSubscribeValidation };
