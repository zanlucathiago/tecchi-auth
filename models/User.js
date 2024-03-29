const { Schema, model } = require('mongoose');

// Create Schema
const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  tenant: {
    enum: ['guapos-agencia', 'public', 'recado-do-ceu'],
    type: String,
    required: true,
  },
});

const User = model('user', UserSchema);

module.exports = User;
