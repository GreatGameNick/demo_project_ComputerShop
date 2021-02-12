const mongoose = require("mongoose");

const specificationsSchema = new mongoose.Schema({
  screenDiagonal: Number,
  color: String,
  warranty: Number,
  release: Number
})

module.exports.productSchema = new mongoose.Schema({
  "shelf": String,
  "code": Number,
  "name": String,
  "description": String,
  "price": Number,
  "img": String,
  "starsCount": Number,
  specifications: specificationsSchema
});






