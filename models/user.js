const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");

const userSchema = new Schema({
  first_name: {
    type: String,
    required: [true, "Please provide your first name"],
  },
  last_name: {
    type: String,
    required: [true, "Please provide your last name"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [5, "Password must be at least 5 characters"],
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (pass) {
        return pass === this.password;
      },
      message: "Passwords do not match",
    },
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

const User = mongoose.model("user", userSchema);

module.exports = User;
