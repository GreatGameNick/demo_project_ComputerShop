const express = require("express");
const assert = require('assert');
const {port, MONGO_URL, mode} = require("./configuration");

const {connectDb} = require("./mongooseHelpers/db");
const {authModel} = require("./mongooseHelpers/models/auth")
const {initialAccounts} = require("../initialData/initialAccounts")
const {identification} = require("./mongooseHelpers/controllers/auth")

const app = express();


app.get("/api/identification/:login", identification)



const startServer = async () => {
  //Загружаем в mongoDb начальные данные - тестовый аккаунт.
  //a. предварительно очищаем db, если осуществляем dev-перезапуск.
  if (mode === 'dev') {
    await authModel.deleteMany({}).exec()
    console.log('=============== AUTH stared on a DEV mode, Очищаем AUTH_db =>')
  }
  
  //b. загружаем
  await authModel.insertMany(initialAccounts)
  .then(function () {
    console.log("=============== initialAccounts is inserted")
  })
  .catch(console.log)
  
  
  app.listen(port, () => {
    console.log(`Started AUTH-service on port ${port}`);
    console.log(`AUTH_Database url ${MONGO_URL}`);
  });
};

connectDb()
.on("error", console.log)
.on("disconnected", connectDb)
.once("open", startServer);
