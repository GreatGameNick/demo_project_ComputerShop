const mongoose = require("mongoose");
const {basketSchema} = require("../schemas/basketSchemas");

module.exports.BasketModel = mongoose.model('baskets', basketSchema);