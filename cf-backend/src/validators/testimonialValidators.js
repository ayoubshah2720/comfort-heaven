const { body, param } = require('express-validator');

const testimonialCreateValidation = [
  body('name').trim().notEmpty().withMessage('name is required'),
  body('content').trim().notEmpty().withMessage('content is required'),
  body('role').optional().trim().notEmpty(),
  body('avatarUrl').optional().trim().notEmpty(),
  body('isActive').optional().isBoolean().withMessage('isActive must be boolean')
];

const testimonialUpdateValidation = [
  body('name').optional().trim().notEmpty().withMessage('name cannot be empty'),
  body('content').optional().trim().notEmpty().withMessage('content cannot be empty'),
  body('role').optional().trim().notEmpty(),
  body('avatarUrl').optional().trim().notEmpty(),
  body('isActive').optional().isBoolean().withMessage('isActive must be boolean'),
  param('id').trim().notEmpty().withMessage('id is required')
];

module.exports = { testimonialCreateValidation, testimonialUpdateValidation };
