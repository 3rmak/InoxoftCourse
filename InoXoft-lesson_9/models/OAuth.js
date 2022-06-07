const { Schema, model } = require('mongoose');

const { databaseTablesEnum } = require('../config');

const OAuthSchema = new Schema({
  access_token: {
    type: String,
    required: true
  },
  refresh_token: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: databaseTablesEnum.USER
  }
}, { timestamps: true });

module.exports = model(databaseTablesEnum.OAUTH, OAuthSchema);
