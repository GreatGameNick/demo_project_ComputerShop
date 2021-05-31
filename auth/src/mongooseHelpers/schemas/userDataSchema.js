const mongoose = require('mongoose');

const basketPointsSchema = new mongoose.Schema({
  shelf: String,
  _id: String
});

module.exports.userDataSchema = new mongoose.Schema({
  basket: [basketPointsSchema]
});
