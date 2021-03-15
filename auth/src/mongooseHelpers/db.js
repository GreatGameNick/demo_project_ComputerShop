const mongoose = require("mongoose");
const {MONGO_URL} = require("../configuration");    //MONGO_URL=mongodb://auth_db:27017/auth, прописано в docker-compose.yml

module.exports.connectDb = () => {
  mongoose.connect(MONGO_URL, {useNewUrlParser: true});
  console.log(' =============== AUTH_mongoose.connections.length = ', mongoose.connections.length)
  return mongoose.connection;
};
