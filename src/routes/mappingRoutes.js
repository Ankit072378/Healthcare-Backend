const express = require('express');
const router = express.Router();
const mappingController = require('../controllers/mappingController');
const authenticateJWT = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  createMappingValidation,
  patientIdParamValidation,
  mappingIdParamValidation
} = require('../validations/mappingValidation');

router.use(authenticateJWT);

router.post('/', createMappingValidation, validate, mappingController.assignDoctor);
router.get('/', mappingController.getAllMappings);
router.get('/:patient_id', patientIdParamValidation, validate, mappingController.getDoctorsByPatientId);
router.delete('/:id', mappingIdParamValidation, validate, mappingController.removeMapping);

module.exports = router;
