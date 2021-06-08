const mongoose = require("mongoose")

const basketPointsSchema = new mongoose.Schema({
  shelf: String,
  _id: String
})

module.exports.sessionBasketSchema = new mongoose.Schema({
  sessionID: String,
  createdAt: {
    default: Date.now(),
    type: Date,
  },
  basketPoints: [basketPointsSchema]
})


