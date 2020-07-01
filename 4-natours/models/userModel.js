const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
      'Please re-enter the password to confirm'
    ],
    validate: {
      // this only works on CREATE or SAVE!!!
      validator: function (val) {
        return val === this.password;
      },
      message: "Password doesn't match"
    }
  }
});

// encryption should happen after we receive the password and before it's actually persisted to the database
userSchema.pre('save', async function (next) {
  // only run this function if password was actually modified
  if (!this.isModified('password')) {
    return next();
  }
  // encrypt the password with the cost of 12
  this.password = await bcrypt.hash(
    this.password,
    16
  );
  // erase the passwordConfirm because we only need it once when user signs up
  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
