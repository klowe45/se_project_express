const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const JWT_SECRET = require("../utils/config");
const BadRequestError = require("../customErrors/BadRequestError");
const UnauthorizedError = require("../customErrors/UnauthorizedError");
const NotFoundError = require("../customErrors/NotFoundError");
const ConflictError = require("../customErrors/ConflictError");

const getCurrentUser = (req, res) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail(() => {
      throw new NotFoundError("User not found");
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.log(err);
      if (err.name === "CastError") {
        throw new BadRequestError("Invalid ID");
      } else {
        next(err);
      }
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("invalid info for created user");
  }
  return User.findOne({ email }).then((existingUser) => {
    if (existingUser) {
      throw new ConflictError("User already created");
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
          throw new BadRequestError("Invalid info entered");
        } else {
          next(err);
        }
      });
  });
};

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password || email.trim() === "" || password.trim() === "") {
    throw new BadRequestError("Enter correct email and password");
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new Error("User ID not found in the database");
      }
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Wrong Email or Password") {
        throw new UnauthorizedError("Enter valid info.");
      } else {
        next(err);
      }
    });
};

const updateProfile = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      throw new BadRequestError("Unable to locate user and update");
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.message === "Unable to find userID") {
        throw new NotFoundError("User not found");
      }
      if (err.name === "ValidationError") {
        throw new BadRequestError("Check entered info");
      } else {
        next(err);
      }
    });
};

module.exports = { createUser, getCurrentUser, login, updateProfile };
