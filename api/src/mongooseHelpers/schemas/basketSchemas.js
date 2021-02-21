const mongoose = require("mongoose");

const productPointSchema = new mongoose.Schema({
  shelf: String,
  _id: mongoose.Schema.Types.ObjectId
});

module.exports.basketSchema = new mongoose.Schema({
  sessionID: String,
  createdDate: Date,
  baskettt: [productPointSchema]
});
