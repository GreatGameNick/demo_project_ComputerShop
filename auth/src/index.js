const express = require("express");
const axios = require("axios");
const {port, host, db, apiUrl} = require("./configuration");
const {connectDb} = require("./mongooseHelpers/db");

const app = express();


app.get("/api/identification/:login", (req, res) => {
  let login = req.params.login
  console.log('================== authData in Auth = ', login)
  
  //запрос на mongoDb и проверка наличия данного логина
  
  
  res.json({isLogin: false});
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
