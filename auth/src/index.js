const express = require("express");
const axios = require("axios");
const { port, host, db, apiUrl } = require("./configuration");
const { connectDb } = require("./helpers/db");

const app = express();


app.get("/api/checkOutAuth/:authData", (req, res) => {
  let [login, password] = req.params.authData.split(';')
  
  console.log('================== authData in Auth = ', login, ' ; ', password)
  res.send({
    isLogin: true,
    isPassword: true,
    accessToken: '016',
    refreshToken: '025'
  });
});







const startServer = () => {
  app.listen(port, () => {
    console.log(`Started AUTH-service on port ${port}`);
    console.log(`Our host is ${host}`);
    console.log(`Database url ${db}`);
  });
};

connectDb()
  .on("error", console.log)
  .on("disconnected", connectDb)
  .once("open", startServer);
