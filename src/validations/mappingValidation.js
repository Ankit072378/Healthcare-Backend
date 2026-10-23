const { body, param } = require('express-validator');

const createMappingValidation = [
  body('patient_id')
    .custom((val, { req }) => {
      const patientId = val || req.body.patientId;
      if (!patientId || !Number.isInteger(Number(patientId)) || Number(patientId) <= 0) {
        throw new Error('Valid patient_id (or patientId) is required');
      }
      return true;
    }),

  body('doctor_id')
    .custom((val, { req }) => {
      const doctorId = val || req.body.doctorId;
      if (!doctorId || !Number.isInteger(Number(doctorId)) || Number(doctorId) <= 0) {
        throw new Error('Valid doctor_id (or doctorId) is required');
      }
      return true;
    }),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters')
];

const patientIdParamValidation = [
  param('patient_id')
    .isInt({ min: 1 })
    .withMessage('patient_id parameter must be a positive integer')
];

const mappingIdParamValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Mapping ID parameter must be a positive integer')
];

module.exports = {
  createMappingValidation,
  patientIdParamValidation,
  mappingIdParamValidation
};
