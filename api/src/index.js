const express = require("express")
const mongoose = require("mongoose")
const axios = require("axios")
const session = require('express-session')
const bodyParser = require('body-parser')
const multer = require('multer')
const methodOverride = require('method-override');
const GridFsStorage = require('multer-gridfs-storage');
const crypto = require('crypto');
const path = require('path');

const {ROOT_PATH, port, MONGO_URL, authApiUrl, mode} = require("./configuration")
const {connectDb} = require("./mongooseHelpers/db")
const {delOneDiskFile, delOneGridFile,
  getOneDiskFile, getOneGridFile,
  getAllDiskFilesName, getAllGridFiles,
  getOneImgFromDiskStorageForPicture, getOneImgFromGridStorageForPicture,
  findAllOnTheShelf, findOneOnTheShelf,
  getSession} = require("./mongooseHelpers/controllers/shop")
const {laptops} = require('./mongooseHelpers/models/shelves')
const {initialLaptopData} = require('../initialData/laptopData')


const app = express();

app.use(bodyParser.json())


//session
//это отдельная специализированный раздел в mongoDb для api-сервиса - заточенный для хранения сессий.
const MongoSessionStore = require('connect-mongo')(session)    //посредник между блоком session и блоком mongoose

const sessionConnection = mongoose.createConnection(MONGO_URL, {useNewUrlParser: true});

app.use(session({
  // name: 'name_of_the_session_ID_cookie',   //имя сессии, ВМЕСТО "connect.sid"
  cookie: {
    httpOnly: false,  //на клиенте эта кука читаться не будет
    maxAge: 1000 * 60
  },
  secret: 'kola',
  resave: false,
  saveUninitialized: false,
  store: new MongoSessionStore({mongooseConnection: sessionConnection, ttl: 14 * 24 * 60 * 60 })
}))




//Текстовые роуты для MongoDb.
//Должны быть прописаны НИЖЕ, чем заявление сессии, т.к. мы сессию генерируем в ходе "/mongoCollection" запроса.
app.get("/shop/:shelf", findAllOnTheShelf)   //use it
app.get("/shop/:shelf/:_id", findOneOnTheShelf)   //use it



//Загружаем файлы в diskStorage.
//a) Декларируем хранилище diskStorage.            //not using yet. Использую diskStorage сразу для считки. Загрузка не востребована.
var diskStorage = multer.diskStorage({
  destination: ROOT_PATH + 'initialData/imgs/',   //ROOT_PATH = "/usr/src/app/"
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
});

//b) заявляем multer, ЛОКАЛЬНО.                    //not using yet
let upload = multer({storage: diskStorage})

//c) роут для upload file to db.                    //not using yet
app.post('/upload_file', upload.single('file'), (req, res) => {
  res.send(`uploadFile ==> ${req.file.originalname}`);
});

//d)Изображение для <img> from diskStorage
app.get("/imgs/:shelf/:imgName", getOneImgFromDiskStorageForPicture)   //< use it (!)


//not using yet
app.get("/getAllGridFiles", getAllGridFiles)
app.get("/getAllDiskFilesName", getAllDiskFilesName)
app.get("/gridImgs/:name", getOneGridFile)
app.get("/diskImgs/:name", getOneDiskFile)
app.delete("/gridImgs/:name", delOneGridFile)
app.delete("/diskImgs/:name", delOneDiskFile)


//запрос на соседний сервис докера.
app.get("/currentUser/:userName", async (req, res) => {
  let userName = req.params.userName
  
  await axios.get(authApiUrl + "/" + userName)
  .then(responseFromAuth => {
    res.json({
      isCurrentUser: true,
      currentUserFromAuth: responseFromAuth.data
    })
  })
})


//функция по старту сервера.
const startServer = async () => {
  //Загружаем в mongoDb начальные данные
  //a. предварительно очищаем db, если осуществляем dev-перезапуск.
  if (mode === 'dev') {
    await laptops.deleteMany({}).exec()
    console.log('=============== Server stared on a DEV mode, Очищаем db =>')
  }
  
  //b. загружаем
  await laptops.insertMany(initialLaptopData)
  .then(function () {
    console.log("=============== Initial data is inserted")
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