const express = require("express")
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const {ROOT_PATH, port, MONGO_URL, mode} = require("./configuration")
const {connectDb} = require("./mongooseHelpers/db")
const {findAllOnTheShelf, findOneOnTheShelf, getOneImgFromDiskStorageForPicture} = require("./mongooseHelpers/controllers/shop")
const {putProductToBasket, deleteProductAtBasket, getBasket, retrieveSessionBasket} = require("./mongooseHelpers/controllers/baskets")
const {laptops, mouses, accessories} = require('./mongooseHelpers/models/shelves')
const {initialLaptopData} = require('../initialData/laptopData')
const {initialMouseData} = require('../initialData/mouseData')
const {initialAccessoriesData} = require('../initialData/accessoriesData')


const app = express()

app.use(bodyParser.json())      //Обязателен для всех запросов, которые имеют pl(для POST-запросов).
app.use(cookieParser('demoProject'))


//Текстовые роуты для MongoDb.
//Должны быть прописаны НИЖЕ, чем заявление сессии, т.к. мы сессию генерируем в ходе "/mongoCollection" запроса.
app.get("/shop/:shelf", findAllOnTheShelf)
app.get("/shop/:shelf/:_id", findOneOnTheShelf)


//basket
app.put("/basket", putProductToBasket)
app.delete("/basket", deleteProductAtBasket)
app.get("/basket", getBasket)



//d)Берем изображения для <img> from diskStorage
app.get("/imgs/:shelf/:imgName", getOneImgFromDiskStorageForPicture)   //Использую diskStorage сразу и только для считки. Загрузка - не востребована, заявлять multer не требуется.


//функция по старту сервера.
const startServer = async () => {
  //Загружаем в mongoDb начальные данные
  //a. предварительно очищаем db, если осуществляем dev-перезапуск.
  if (mode === 'dev') {
    await laptops.deleteMany({}).exec()
    await mouses.deleteMany({}).exec()
    await accessories.deleteMany({}).exec()
    console.log('=============== Server stared on a DEV mode, Очищаем db =>')
  }
  
  //b. загружаем
  await laptops.insertMany(initialLaptopData)
  .then(function () {
    console.log("=============== initialLaptopData is inserted")
  })
  .catch(console.log)
  
  await mouses.insertMany(initialMouseData)
  .then(function () {
    console.log("=============== initialMouseData is inserted")
  })
  .catch(console.log)
  
  await accessories.insertMany(initialAccessoriesData)
  .then(function () {
    console.log("=============== initialAccessoriesData is inserted")
  })
  .catch(console.log)
  
  app.listen(port, () => {
    console.log(`=============== Started api service on port ${port}`);
    console.log(`=============== Database url is ${MONGO_URL}`);
  });
};


// Запускаем mongoose и после формирования соединения стартуем у сервера прослушивание им своего порта 3001.
connectDb()
.on("error", console.log)
.on("disconnected", connectDb)   //если рассоединились, то запускаем соединение заново
.once("open", startServer);      //когда коннект с bd установлен мы стартуем процесс прослушивания у запущенного сервера.
