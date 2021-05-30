const mongoose = require("mongoose")
const userSchema = require("./accountSchema")

module.exports.authSchema = new mongoose.Schema({
  login: String,
  password: String,
  accessToken: String,
  refreshToken: String,
  userData: {
    type: userSchema,
    default: {}
  }
})



