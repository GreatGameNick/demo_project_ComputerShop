const mongoose = require("mongoose");

module.exports.authSchema = new mongoose.Schema({
  login: String,
  password: String,
  isAuthorization: Boolean,
  accessToken: String,
  refreshToken: String
})



