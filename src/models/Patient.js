const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class Patient extends Model {}

Patient.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Patient name is required' }
      }
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: 'Age must be an integer' },
        min: { args: [0], msg: 'Age cannot be negative' },
        max: { args: [150], msg: 'Age must be realistic (0-150)' }
      }
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Gender is required' }
      }
    },
    contact: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Contact number is required' }
      }
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    medical_history: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: 'None recorded'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    }
  },
  {
    sequelize,
    modelName: 'Patient',
    tableName: 'patients',
    timestamps: true
  }
);

module.exports = Patient;
