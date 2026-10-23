const { Doctor, Patient } = require('../models');

const addDoctor = async (req, res, next) => {
  try {
    const { name, specialization, phone, email, experience_years, experienceYears } = req.body;

    const existingDoctor = await Doctor.findOne({ where: { email } });
    if (existingDoctor) {
      return res.status(409).json({
        success: false,
        message: 'A doctor with this email is already registered.'
      });
    }

    const newDoctor = await Doctor.create({
      name,
      specialization,
      phone,
      email,
      experience_years: experience_years ?? experienceYears ?? 0
    });

    return res.status(201).json({
      success: true,
      message: 'Doctor record created successfully.',
      data: newDoctor
    });
  } catch (error) {
    next(error);
  }
};

const getAllDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.findAll({
      order: [['name', 'ASC']]
    });

    return res.status(200).json({
      success: true,
      count: doctors.length,
      message: 'Doctors retrieved successfully.',
      data: doctors
    });
  } catch (error) {
    next(error);
  }
};

const getDoctorById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findByPk(id, {
      include: [
        {
          model: Patient,
          as: 'patients',
          through: { attributes: ['id', 'notes', 'createdAt'] }
        }
      ]
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: `Doctor with ID ${id} not found.`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Doctor details retrieved successfully.',
      data: doctor
    });
  } catch (error) {
    next(error);
  }
};

const updateDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, specialization, phone, email, experience_years, experienceYears } = req.body;

    const doctor = await Doctor.findByPk(id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: `Doctor with ID ${id} not found.`
      });
    }

    if (email && email !== doctor.email) {
      const emailExists = await Doctor.findOne({ where: { email } });
      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: 'A doctor with this email already exists.'
        });
      }
    }

    await doctor.update({
      ...(name !== undefined && { name }),
      ...(specialization !== undefined && { specialization }),
      ...(phone !== undefined && { phone }),
      ...(email !== undefined && { email }),
      ...(experience_years !== undefined && { experience_years }),
      ...(experienceYears !== undefined && { experience_years: experienceYears })
    });

    return res.status(200).json({
      success: true,
      message: 'Doctor details updated successfully.',
      data: doctor
    });
  } catch (error) {
    next(error);
  }
};

const deleteDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findByPk(id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: `Doctor with ID ${id} not found.`
      });
    }

    await doctor.destroy();

    return res.status(200).json({
      success: true,
      message: `Doctor record with ID ${id} deleted successfully.`
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor
};
