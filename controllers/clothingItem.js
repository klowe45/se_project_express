const ClothingItem = require("../models/clothingItem");
const BadRequestError = require("../customErrors/BadRequestError");
const ForbiddenError = require("../customErrors/ForbiddenError");
const NotFoundError = require("../customErrors/NotFoundError");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  ClothingItem.create({
    name,
    weather,
    imageUrl,
    owner,
  })
    .then((item) => {
      res.status(201).send({ data: item });
    })
    .catch((err) => {
      console.lost(err);
      if (err.name === "ValidationError") {
        next(new BadRequestError("Error with entered data."));
      } else {
        next(err);
      }
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      next(err);
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  if (!itemId) {
    throw new NotFoundError("No user ID found");
  }

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== userId) {
        next(new ForbiddenError("Unmatched user ID"));
      }

      return ClothingItem.findByIdAndDelete(itemId).then((deletedItem) => {
        if (!deleteItem) {
          throw new ForbiddenError("Unable to find item.");
        }
        return res
          .status(200)
          .send({ message: "Item was deleted", deletedItem });
      });
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item not found"));
      }
      if (err.name === "CastError") {
        throw new BadRequestError("Invalid ID");
      } else {
        next(err);
      }
    });
};

const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        throw new NotFoundError("Id not found for like.");
      }
      if (err.name === "CastError") {
        throw new BadRequestError("Invalid ID");
      } else {
        next(err);
      }
    });
};

const dislikeItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!itemId) {
    throw new BadRequestError("Invalid ID to dislike item");
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Item was not located.");
      }
      return res.status(200).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequestError("Invalid ID");
      } else {
        next(err);
      }
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
