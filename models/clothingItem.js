const mongoose = require("mongoose");
const validator = require("valiidator");

const cothingItemSchemas = new mongoose.Schema({
  name: {
    type: String,
  },
  weather: {},
  imageURL: {},
  owner: {},
  likes: {},
});

module.exports = mongoose.model("user", cothingItemSchemas);
