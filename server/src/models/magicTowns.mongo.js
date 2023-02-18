const mongoose = require("mongoose");

const magicTownsSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  magicTown: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  population: {
    type: Number,
    required: true,
  },
  images: {
    type: [String],
    required: false,
  },
  description: {
    type: String,
    required: false,
    default: "Lorem"
  },
  wiki: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("Magic-Town", magicTownsSchema);
