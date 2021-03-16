const express = require("express");
const assert = require('assert');
const bodyParser = require('body-parser')
const {port, MONGO_URL, mode} = require("./configuration");

const {connectDb} = require("./mongooseHelpers/db");
const {authModel} = require("./mongooseHelpers/models/auth")
const {initialAccounts} = require("../initialData/initialAccounts")
const {identification, createAccount, login} = require("./mongooseHelpers/controllers/auth")

const app = express();
app.use(bodyParser.json())    //(!) Обязателен для всех запросов, которые имеют pl.


app.get("/api/identification/:login", identification)   //префикс "/api" добавился из authApiUrl (http://auth:3002/api), и далее основное доменное имя http://auth:3002/ отброшено express'ом.
app.post("/api/authentication", createAccount)         //Поэтому в имени роутера должен фигурировать "/api".
app.get("/api/authentication/:auth", login)


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
