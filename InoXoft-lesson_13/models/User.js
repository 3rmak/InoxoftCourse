const { Schema, model } = require('mongoose');

const { userRoleEnum, databaseTablesEnum } = require('../config');

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
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
  },
  isActive: {
    type: Boolean,
    default: false,
    required: true,
    select: false
  },
  avatar: {
    type: Object
  },
}, { timestamps: true });

const userCollection = model(databaseTablesEnum.USER, userSchema);

_createInitialAdmin();

async function _createInitialAdmin() {
  try {
    const initialAdmin = await userCollection.findOne({ email: 'admin@best.service.com' });

    if (!initialAdmin) {
      await userCollection
        .create({
          email: 'admin@best.service.com',
          password: 'admin',
          name: 'admin',
          surname: 'admin',
          role: userRoleEnum.SuperAdmin,
          isActive: true
        });
    }
  } catch (error) {
    console.log('Error while creating initialAdmin in mongo', error.message);
  }
}

module.exports = userCollection;
