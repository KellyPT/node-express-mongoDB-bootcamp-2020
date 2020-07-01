const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsyncError = require('../utils/catchAsyncError');
const AppError = require('../utils/appError');

const authToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN
    }
  );
};
exports.signUp = catchAsyncError(
  async (req, res, next) => {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm
    });

    const token = authToken(newUser._id);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser
      }
    });
  }
);

exports.logIn = catchAsyncError(
  async (req, res, next) => {
    const { email, password } = req.body;
    // 1- check if email and password exist
    if (!email || !password) {
      return next(
        new AppError(
          'Please provide your email and password',
          400
        )
      );
    }

    // 2- check if user exists and password is correct
    // since in User model, we mask the password in response to any mongo queries, we need to add it back here
    const user = await User.findOne({
      email
    }).select('+password');
    // console.log('Im inside login route', user);

    // we need to encrypt the password sent over in HTTP request in order to compare it with encrypted password saved in MongoDB
    if (
      !user ||
      !(await user.correctPassword(
        password,
        user.password
      ))
    ) {
      return next(
        new AppError(
          'Incorrect email or password',
          401
        )
      );
    }
    // 3- if everything is ok, send the token to client
    const token = authToken(user._id);
    res
      .status(200)
      .json({ status: 'success', token });
  }
);
