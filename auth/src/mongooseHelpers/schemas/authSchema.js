const mongoose = require("mongoose");

module.exports.authSchema = new mongoose.Schema({
  login: String,
  password: String,
  accessToken: String,
  refreshToken: String
})



