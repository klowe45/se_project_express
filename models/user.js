const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchemas = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(values) {
        return validator.isURL(values);
      },
      message: "You must enter a valid URL",
    },
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: (values = {
        validator: validator.isEmail(values),
        message: "Invalid email format",
      }),
    },
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});

userSchemas.statics.findUserByCredentials = function (email, password) {
  if (!email || !password) {
    return Promise.reject(new Error("Email and password are required"));
  }
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Wrong Email or Password"));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Wrong Email or Password"));
        }
        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchemas);
