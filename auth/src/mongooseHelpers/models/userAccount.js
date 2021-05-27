const mongoose = require("mongoose");
const {productSchema} = require("../schemas/productSchemas");

module.exports.laptops = mongoose.model('laptops', productSchema);
module.exports.mouses = mongoose.model('mouses', productSchema);
module.exports.accessories = mongoose.model('accessories', productSchema);














