const mongoose = require("mongoose");
const {authSchema} = require("../schemas/authSchema");

module.exports.authModel = mongoose.model('auth', authSchema);