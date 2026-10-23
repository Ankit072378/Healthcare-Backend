const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const authenticateJWT = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  createPatientValidation,
  updatePatientValidation,
  patientIdParamValidation
} = require('../validations/patientValidation');

router.use(authenticateJWT);

router.post('/', createPatientValidation, validate, patientController.addPatient);
router.get('/', patientController.getAllPatients);
router.get('/:id', patientIdParamValidation, validate, patientController.getPatientById);
router.put('/:id', updatePatientValidation, validate, patientController.updatePatient);
router.delete('/:id', patientIdParamValidation, validate, patientController.deletePatient);

module.exports = router;
