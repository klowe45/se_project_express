const mongoose = require("mongoose");
const validator = require("valiidator");

const cothingItemSchemas = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  weather: {
    type: String,
    validate: {
      enum: ["hot", "cold", "warm"],
    },
  },
  imageURL: {
    type: String,
    required: true,
    validatite: {
      validator: (values) => validator.isURL(values),
      message: "Need vaild URL",
    },
  },
  owner: {
    type: String,
  },
  likes: {},
});

module.exports = mongoose.model("colthingItem", cothingItemSchemas);
