const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const { promisify } = require("util");
const tryCatchError = require("../utils/tryCatchError");
const AppError = require("../utils/appError");
const bcrypt = require("bcrypt");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

// Define a function to create a token
const signToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

// <-------------------------------------------------------------------Sign up--------------------------------------------------------------------------->
/**
 * @description Sign up a new user
 * @route POST /api/users/signup
 * @access Public
 */
exports.signup = tryCatchError(async (req, res, next) => {
  const newUser = await userModel.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
  });

  const token = signToken(newUser._id);
  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});

// <-------------------------------------------------------------------Login--------------------------------------------------------------------------->
/**
 * @description Login a user
 * @route POST /api/users/login
 * @access Public
 */
exports.login = tryCatchError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }
  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    return next(new AppError("User not found", 401));
  }
  const validatePass = bcrypt.compare(password, user.password);
  if (!validatePass) {
    return next(new AppError("Incorrect password or email", 401));
  }
  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
});

// <------------------------------------------------------Protecting routes => Authentication------------------------------------------------------------->
/**
 * @description Protecting routes => Authentication
 */

exports.authenticate = tryCatchError(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("Unauthorized!!!. Please login to continue", 401));
  }
  // Verify the token
  const user = await promisify(jwt.verify)(token, JWT_SECRET);

  // check if the user still exists
  const CurrentUser = await userModel.findById(user.id);
  if (!CurrentUser) {
    return next(new AppError("User no longer exists", 401));
  }

  req.user = CurrentUser;
  next();
});
