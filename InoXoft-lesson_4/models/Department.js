const { Schema, model } = require('mongoose');

const departmentSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  owner: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = model('department', departmentSchema);
