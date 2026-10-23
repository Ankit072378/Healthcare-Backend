const { body, param } = require('express-validator');

const createDoctorValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Doctor name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Doctor name must be between 2 and 100 characters'),

  body('specialization')
    .trim()
    .notEmpty()
    .withMessage('Specialization is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Specialization must be between 2 and 100 characters'),

  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .isLength({ min: 7, max: 20 })
    .withMessage('Phone number must be between 7 and 20 characters'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('experience_years')
    .optional()
    .isInt({ min: 0, max: 70 })
    .withMessage('Experience years must be an integer between 0 and 70')
];

const updateDoctorValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Doctor ID must be a positive integer'),

  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Doctor name cannot be empty')
    .isLength({ min: 2, max: 100 })
    .withMessage('Doctor name must be between 2 and 100 characters'),

  body('specialization')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Specialization cannot be empty')
    .isLength({ min: 2, max: 100 })
    .withMessage('Specialization must be between 2 and 100 characters'),

  body('phone')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Phone number cannot be empty')
    .isLength({ min: 7, max: 20 })
    .withMessage('Phone number must be between 7 and 20 characters'),

  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('experience_years')
    .optional()
    .isInt({ min: 0, max: 70 })
    .withMessage('Experience years must be an integer between 0 and 70')
];

const doctorIdParamValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Doctor ID must be a positive integer')
];

module.exports = {
  createDoctorValidation,
  updateDoctorValidation,
  doctorIdParamValidation
};
