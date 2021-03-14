const mongoose = require("mongoose");
const {MONGO_URL} = require("../configuration");

module.exports.connectDb = () => {
  mongoose.connect(MONGO_URL, {useNewUrlParser: true});
  console.log(' =============== AUTH_mongoose.connections.length = ', mongoose.connections.length)
  return mongoose.connection;
};
