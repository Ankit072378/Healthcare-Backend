const { Patient, Doctor, User } = require('../models');

const addPatient = async (req, res, next) => {
  try {
    const { name, age, gender, contact, address, medical_history, medicalHistory } = req.body;

    const newPatient = await Patient.create({
      name,
      age,
      gender,
      contact,
      address,
      medical_history: medical_history || medicalHistory || 'None recorded',
      userId: req.user.id
    });

    return res.status(201).json({
      success: true,
      message: 'Patient record created successfully.',
      data: newPatient
    });
  } catch (error) {
    next(error);
  }
};

const getAllPatients = async (req, res, next) => {
  try {
    const patients = await Patient.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Doctor,
          as: 'doctors',
          through: { attributes: ['id', 'notes', 'createdAt'] }
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      count: patients.length,
      message: 'Patients retrieved successfully.',
      data: patients
    });
  } catch (error) {
    next(error);
  }
};

const getPatientById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const patient = await Patient.findByPk(id, {
      include: [
        {
          model: Doctor,
          as: 'doctors',
          through: { attributes: ['id', 'notes', 'createdAt'] }
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: `Patient with ID ${id} not found.`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Patient details retrieved successfully.',
      data: patient
    });
  } catch (error) {
    next(error);
  }
};

const updatePatient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, age, gender, contact, address, medical_history, medicalHistory } = req.body;

    const patient = await Patient.findByPk(id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: `Patient with ID ${id} not found.`
      });
    }

    if (patient.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You are not authorized to update this patient record.'
      });
    }

    await patient.update({
      ...(name !== undefined && { name }),
      ...(age !== undefined && { age }),
      ...(gender !== undefined && { gender }),
      ...(contact !== undefined && { contact }),
      ...(address !== undefined && { address }),
      ...(medical_history !== undefined && { medical_history }),
      ...(medicalHistory !== undefined && { medical_history: medicalHistory })
    });

    return res.status(200).json({
      success: true,
      message: 'Patient details updated successfully.',
      data: patient
    });
  } catch (error) {
    next(error);
  }
};

const deletePatient = async (req, res, next) => {
  try {
    const { id } = req.params;

    const patient = await Patient.findByPk(id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: `Patient with ID ${id} not found.`
      });
    }

    if (patient.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You are not authorized to delete this patient record.'
      });
    }

    await patient.destroy();

    return res.status(200).json({
      success: true,
      message: `Patient record with ID ${id} deleted successfully.`
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient
};
