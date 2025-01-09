const mongoose = require("mongoose");
const validator = require("validator");

const cothingItem = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  weather: {
    type: String,
    required: true,
    enum: ["hot", "cold", "warm"],
  },
  imageURL: {
    type: String,
    required: true,
    validate: {
      validator: (values) => validator.isURL(values),
      message: "Need vaild URL",
    },
  },
  owner: {
    type: String,
  },
  likes: {},
});

module.exports = mongoose.model("colthingItems", cothingItem);
