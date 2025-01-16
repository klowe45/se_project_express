const User = require("../models/user");
const {
  BAD_REQUEST,
  UNAUTHORIZED_ACCESS,
  NOT_FOUND,
  SERVER_ERROR,
  CONFLICTING_ERROR,
} = require("../utils/errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../utils/config");

const getCurrentUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      const error = new Error("User ID not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.log(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Unable to find User" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invailed user ID" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "Server error on getting user" });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  if (!email) {
    return res.status(BAD_REQUEST).send({ message: "Error, check Email" });
  }
  return User.findOne({ email }).then((existingUser) => {
    if (existingUser) {
      return res
        .status(CONFLICTING_ERROR)
        .send({ message: "Email already used" });
    }
    return bcrypt
      .hash(password, 10)
      .then((hash) => User.create({ name, avatar, email, password: hash }))
      .then((user) =>
        res
          .status(201)
          .send({ name: user.name, email: user.email, avatar: user.avatar })
      )
      .catch((err) => {
        if (err.name === "ValidationError") {
          return res
            .status(BAD_REQUEST)
            .send({ message: "Unable to create User" });
        }
        res
          .status(SERVER_ERROR)
          .send({ message: "Server error on created user" });
      });
  });
};

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password || email.trim() === "" || password.trim() === "") {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Email and password are required" });
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Wrong Email or Password") {
        return res
          .status(UNAUTHORIZED_ACCESS)
          .send({ message: "Wrong Email or Password" });
      }
      if (err.name)
        return res
          .status(SERVER_ERROR)
          .send({ message: "Server Error on userLogin" });
    });
};

const updateProfile = (req, res) => {
  const userId = req.params._id;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      const error = new Error("Unable to find userID");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.message === "Unable to find userID") {
        return res.status(NOT_FOUND).send({ message: "Unable to find userID" });
      }
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Unknown input during validation" });
      }
      return res.status(SERVER_ERROR).send({ message: "Server Error" });
    });
};

module.exports = { createUser, getCurrentUser, login, updateProfile };
