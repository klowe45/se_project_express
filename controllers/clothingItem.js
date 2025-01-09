const ClothingItem = require("../models/clothingItem");
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require("../utils/errors");

const createItem = (req, res) => {
  console.log(req);
  console.log(res.body);

  const { name, weather, imageURL, likes, createdAt } = req.body;

  ClothingItem.create({
    name,
    weather,
    imageURL,
    owner: req.user._id,
    likes,
    createdAt,
  })
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((err) =>
      res.status(BAD_REQUEST).send({ message: "Error from createItem", err })
    );
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      res.status(NOT_FOUND).send({ message: "Error in getItems", err });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageURL } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageURL } })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.log(err.name);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid Information", err });
      }
      return res.status(SERVER_ERROR).send({ message: "Server Error" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(204).send(item))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Unable to delete", err });
      } else if (err.name === "CastError") {
        return res
          .status(SERVER_ERROR)
          .send({ message: "Server error on delete" });
      }
    });
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(req.params.itemId, {
    $addToSet: { likes: req.user._id },
    new: true,
  })
    .onFail()
    .then((item) => {
      res.setHeaders("Content-Type", "application/json");
      res.send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ItemNotFound") {
        return res.status(NOT_FOUND).send({ message: "Unable to like" });
      } else if (err.name === "CastError") {
        return res
          .status(SERVER_ERROR)
          .send({ message: "Server Error on like" });
      }
    });
};

const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(req.params.itemId, {
    $pull: { likes: req.user._id },
    new: true,
  })
    .orFail()
    .then((item) => {
      res.setHeaders("Content-Type", "application/json");
      res.status(202).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ItemNotFound") {
        return res.status(NOT_FOUND).send({ message: "Unable to dislike" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "Server Error on dislike" });
    });
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
