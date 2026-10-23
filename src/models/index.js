const { sequelize } = require('../config/database');
const User = require('./User');
const Patient = require('./Patient');
const Doctor = require('./Doctor');
const PatientDoctor = require('./PatientDoctor');

User.hasMany(Patient, {
  foreignKey: 'userId',
  as: 'patients',
  onDelete: 'CASCADE'
});
Patient.belongsTo(User, {
  foreignKey: 'userId',
  as: 'creator'
});

Patient.belongsToMany(Doctor, {
  through: PatientDoctor,
  foreignKey: 'patientId',
  otherKey: 'doctorId',
  as: 'doctors'
});

Doctor.belongsToMany(Patient, {
  through: PatientDoctor,
  foreignKey: 'doctorId',
  otherKey: 'patientId',
  as: 'patients'
});

Patient.hasMany(PatientDoctor, {
  foreignKey: 'patientId',
  as: 'mappings',
  onDelete: 'CASCADE'
});
PatientDoctor.belongsTo(Patient, {
  foreignKey: 'patientId',
  as: 'patient'
});

Doctor.hasMany(PatientDoctor, {
  foreignKey: 'doctorId',
  as: 'mappings',
  onDelete: 'CASCADE'
});
PatientDoctor.belongsTo(Doctor, {
  foreignKey: 'doctorId',
  as: 'doctor'
});

module.exports = {
  sequelize,
  User,
  Patient,
  Doctor,
  PatientDoctor
};
