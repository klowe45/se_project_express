const User = require("../models/user");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(201).send(users))
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err.message });
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
        return res.status(404).send({ message: err.message });
      } else if (err.name === "CastError") {
        return res.status(400).send({ message: "Invailed user ID" });
      }
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.log(err);
      if (err === "ValidationError") {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports = { getUsers, createUser, getUser };
