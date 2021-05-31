const mongoose = require("mongoose")
const userDataSchema = require("./userDataSchema")

module.exports.authSchema = new mongoose.Schema({
  login: String,
  password: String,
  accessToken: String,
  refreshToken: String,
  userData: {
    type: userDataSchema,
    default: {}
  }
})



