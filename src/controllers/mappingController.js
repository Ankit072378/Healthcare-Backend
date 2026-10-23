const { PatientDoctor, Patient, Doctor } = require('../models');

const assignDoctor = async (req, res, next) => {
  try {
    const patientId = req.body.patient_id || req.body.patientId;
    const doctorId = req.body.doctor_id || req.body.doctorId;
    const { notes } = req.body;

    const patient = await Patient.findByPk(patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: `Patient with ID ${patientId} not found.`
      });
    }

    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: `Doctor with ID ${doctorId} not found.`
      });
    }

    const existingMapping = await PatientDoctor.findOne({
      where: {
        patientId,
        doctorId
      }
    });

    if (existingMapping) {
      return res.status(409).json({
        success: false,
        message: `Doctor (ID: ${doctorId}) is already assigned to Patient (ID: ${patientId}).`
      });
    }

    const mapping = await PatientDoctor.create({
      patientId,
      doctorId,
      notes: notes || null
    });

    const populatedMapping = await PatientDoctor.findByPk(mapping.id, {
      include: [
        {
          model: Patient,
          as: 'patient',
          attributes: ['id', 'name', 'age', 'gender', 'contact']
        },
        {
          model: Doctor,
          as: 'doctor',
          attributes: ['id', 'name', 'specialization', 'phone', 'email']
        }
      ]
    });

    return res.status(201).json({
      success: true,
      message: 'Doctor successfully assigned to patient.',
      data: populatedMapping
    });
  } catch (error) {
    next(error);
  }
};

const getAllMappings = async (req, res, next) => {
  try {
    const mappings = await PatientDoctor.findAll({
      include: [
        {
          model: Patient,
          as: 'patient',
          attributes: ['id', 'name', 'age', 'gender', 'contact']
        },
        {
          model: Doctor,
          as: 'doctor',
          attributes: ['id', 'name', 'specialization', 'phone', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      count: mappings.length,
      message: 'Patient-doctor mappings retrieved successfully.',
      data: mappings
    });
  } catch (error) {
    next(error);
  }
};

const getDoctorsByPatientId = async (req, res, next) => {
  try {
    const { patient_id } = req.params;

    const patient = await Patient.findByPk(patient_id);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: `Patient with ID ${patient_id} not found.`
      });
    }

    const mappings = await PatientDoctor.findAll({
      where: { patientId: patient_id },
      include: [
        {
          model: Doctor,
          as: 'doctor',
          attributes: ['id', 'name', 'specialization', 'phone', 'email', 'experience_years']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      patient: {
        id: patient.id,
        name: patient.name
      },
      count: mappings.length,
      message: `Doctors assigned to patient ${patient.name} retrieved successfully.`,
      data: mappings
    });
  } catch (error) {
    next(error);
  }
};

const removeMapping = async (req, res, next) => {
  try {
    const { id } = req.params;

    const mapping = await PatientDoctor.findByPk(id);

    if (!mapping) {
      return res.status(404).json({
        success: false,
        message: `Mapping with ID ${id} not found.`
      });
    }

    await mapping.destroy();

    return res.status(200).json({
      success: true,
      message: `Patient-Doctor mapping with ID ${id} removed successfully.`
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  assignDoctor,
  getAllMappings,
  getDoctorsByPatientId,
  removeMapping
};
