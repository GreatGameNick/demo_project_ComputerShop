const mongoose = require("mongoose");

const productPointSchema = new mongoose.Schema({
  shelf: String,
  _id: String
});

module.exports.basketSchema = new mongoose.Schema({
  sessionID: String,
  createdDate: Date,
  basket: [productPointSchema]
});
