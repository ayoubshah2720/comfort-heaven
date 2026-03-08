const { body } = require('express-validator');

const postCreateValidation = [
  body('title').trim().notEmpty().withMessage('title is required'),
  body('content').trim().notEmpty().withMessage('content is required'),
  body('categoryId').trim().notEmpty().withMessage('categoryId is required'),
  body('summary').optional().trim().notEmpty().withMessage('summary cannot be empty'),
  body('tagIds').optional().isArray().withMessage('tagIds must be an array'),
  body('tagIds.*')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('tagId cannot be empty'),
  body('isPublished').optional().isBoolean().withMessage('isPublished must be boolean')
];

const postUpdateValidation = [
  body('title').optional().trim().notEmpty().withMessage('title cannot be empty'),
  body('content').optional().trim().notEmpty().withMessage('content cannot be empty'),
  body('categoryId').optional().trim().notEmpty().withMessage('categoryId cannot be empty'),
  body('summary').optional().trim().notEmpty().withMessage('summary cannot be empty'),
  body('tagIds').optional().isArray().withMessage('tagIds must be an array'),
  body('tagIds.*')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('tagId cannot be empty'),
  body('isPublished').optional().isBoolean().withMessage('isPublished must be boolean')
];

module.exports = { postCreateValidation, postUpdateValidation };
