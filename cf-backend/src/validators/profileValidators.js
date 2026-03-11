const { body } = require('express-validator');

const updateProfileValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('username').optional().trim()
    .isLength({ min: 3, max: 30 }).withMessage('Username must be 3-30 characters')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores'),
  body('phone').optional().trim(),
  body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Invalid gender value'),
];

module.exports = { updateProfileValidation };
