const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class PatientDoctor extends Model {}

PatientDoctor.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'patient_id',
      references: {
        model: 'patients',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    doctorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'doctor_id',
      references: {
        model: 'doctors',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'PatientDoctor',
    tableName: 'patient_doctor_mappings',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['patient_id', 'doctor_id'],
        name: 'unique_patient_doctor_assignment'
      }
    ]
  }
);

module.exports = PatientDoctor;
