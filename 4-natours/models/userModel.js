const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true, // transform email to lowercase, not a validator
    validate: [
      validator.isEmail,
      'Please provide a valid email'
    ]
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please set a password'],
    minlength: 8
  },
  passwordConfirm: {
    type: String,
    required: [
      true,
      'A user must re-enter the password to confirm'
    ],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: "Password doesn't match"
    }
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
