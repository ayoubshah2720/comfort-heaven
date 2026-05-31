const { body } = require('express-validator');

const addressCreateValidation = [
  body('label').trim().notEmpty().withMessage('label is required'),
  body('address1').trim().notEmpty().withMessage('address1 is required'),
  body('city').trim().notEmpty().withMessage('city is required'),
  body('state').trim().notEmpty().withMessage('state is required'),
  body('zipCode').trim().notEmpty().withMessage('zipCode is required'),
  body('phone').trim().notEmpty().withMessage('phone is required'),
  body('company').optional().trim(),
  body('address2').optional().trim(),
  body('country').optional().trim(),
  body('isDefault').optional().isBoolean().withMessage('isDefault must be a boolean')
];

const addressUpdateValidation = [
  body('label').optional().trim().notEmpty().withMessage('label cannot be empty'),
  body('address1').optional().trim().notEmpty().withMessage('address1 cannot be empty'),
  body('city').optional().trim().notEmpty().withMessage('city cannot be empty'),
  body('state').optional().trim().notEmpty().withMessage('state cannot be empty'),
  body('zipCode').optional().trim().notEmpty().withMessage('zipCode cannot be empty'),
  body('phone').optional().trim().notEmpty().withMessage('phone cannot be empty'),
  body('company').optional().trim(),
  body('address2').optional().trim(),
  body('country').optional().trim(),
  body('isDefault').optional().isBoolean().withMessage('isDefault must be a boolean')
];

module.exports = { addressCreateValidation, addressUpdateValidation };
