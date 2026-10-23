const { body, param } = require('express-validator');

const createPatientValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Patient name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Patient name must be between 2 and 100 characters'),

  body('age')
    .notEmpty()
    .withMessage('Age is required')
    .isInt({ min: 0, max: 150 })
    .withMessage('Age must be an integer between 0 and 150'),

  body('gender')
    .trim()
    .notEmpty()
    .withMessage('Gender is required')
    .isIn(['Male', 'Female', 'Other', 'male', 'female', 'other'])
    .withMessage('Gender must be Male, Female, or Other'),

  body('contact')
    .trim()
    .notEmpty()
    .withMessage('Contact phone number is required')
    .isLength({ min: 7, max: 20 })
    .withMessage('Contact must be between 7 and 20 characters'),

  body('address')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Address cannot exceed 500 characters'),

  body('medical_history')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Medical history cannot exceed 2000 characters')
];

const updatePatientValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Patient ID must be a positive integer'),

  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Patient name cannot be empty')
    .isLength({ min: 2, max: 100 })
    .withMessage('Patient name must be between 2 and 100 characters'),

  body('age')
    .optional()
    .isInt({ min: 0, max: 150 })
    .withMessage('Age must be an integer between 0 and 150'),

  body('gender')
    .optional()
    .trim()
    .isIn(['Male', 'Female', 'Other', 'male', 'female', 'other'])
    .withMessage('Gender must be Male, Female, or Other'),

  body('contact')
    .optional()
    .trim()
    .isLength({ min: 7, max: 20 })
    .withMessage('Contact must be between 7 and 20 characters'),

  body('address')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Address cannot exceed 500 characters'),

  body('medical_history')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Medical history cannot exceed 2000 characters')
];

const patientIdParamValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Patient ID must be a positive integer')
];

module.exports = {
  createPatientValidation,
  updatePatientValidation,
  patientIdParamValidation
};
