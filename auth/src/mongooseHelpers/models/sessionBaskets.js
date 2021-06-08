const mongoose = require("mongoose");
const {sessionBasketSchema} = require("../schemas/sessionBasketSchemas");

module.exports.SessionBasketModel = mongoose.model('baskets', sessionBasketSchema);