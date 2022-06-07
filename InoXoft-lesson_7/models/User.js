const { Schema, model } = require('mongoose');

const { userRoleEnum, databaseTablesEnum } = require('../config');

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  surname: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number
  },
  role: {
    type: String,
    default: userRoleEnum.Manager,
    enum: Object.values(userRoleEnum),
    required: true
  },
  password: {
    type: String,
    required: true,
    select: false
  }
}, { timestamps: true });

module.exports = model(databaseTablesEnum.USER, userSchema);
