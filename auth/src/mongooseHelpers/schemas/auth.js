const mongoose = require("mongoose");

// module.exports.Identification = new mongoose.Schema({
//   login: String
// })
//
// module.exports.Authentication = new mongoose.Schema({
// })

// Authorization

module.exports.Auth = new mongoose.Schema({
  login: String,
  password: String,
  isAuthorization: Boolean,
  accessToken: String,
  refreshToken: String
})



