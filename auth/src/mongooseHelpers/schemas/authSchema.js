const mongoose = require("mongoose")
const userSchema = require("./accountSchema")

const basketPointsSchema = new mongoose.Schema({
  shelf: String,
  _id: String
});


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



