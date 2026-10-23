const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const authenticateJWT = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  createDoctorValidation,
  updateDoctorValidation,
  doctorIdParamValidation
} = require('../validations/doctorValidation');

router.use(authenticateJWT);

router.post('/', createDoctorValidation, validate, doctorController.addDoctor);
router.get('/', doctorController.getAllDoctors);
router.get('/:id', doctorIdParamValidation, validate, doctorController.getDoctorById);
router.put('/:id', updateDoctorValidation, validate, doctorController.updateDoctor);
router.delete('/:id', doctorIdParamValidation, validate, doctorController.deleteDoctor);

module.exports = router;
