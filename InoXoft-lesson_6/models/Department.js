const { Schema, model } = require('mongoose');

// const User = require('./User');

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
  },

  // employers: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = model('department', departmentSchema);
