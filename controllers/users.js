const User = require("../models/user");
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .orFail()
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      return res.status(NOT_FOUND).send({ message: err.message });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.log(err);
      if (err.name === "Document not found Error") {
        return res.status(NOT_FOUND).send({ message: err.message });
      }
      return res.status(BAD_REQUEST).send({ message: "Invailed user ID" });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Unable to create user" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "Server Error on created user" });
    });
};

module.exports = { getUsers, createUser, getUser };
