const mongoose = require("mongoose")
const Grid = require('gridfs-stream')
const assert = require('assert');
const fs = require('fs');

var {laptops, mouses, accessories} = require('../models/shelves')
const {ROOT_PATH, port, MONGO_URL, authApiUrl, mode} = require("../../configuration")


//Текстовые роуты для MongoDb.
function choseTheShelf(req) {
  switch (req.params.shelf) {
    case "laptops":
      return  laptops
    case "mouses":
      return mouses
    case "accessories":
      return accessories
  }
}

module.exports.findAllOnTheShelf = async (req, res) => {    // use it
  if (!req.session.i)
    req.session.i = 0;
  ++req.session.i;
  
  console.log('======================1. req.sessionID = ', req.sessionID)
  
  
  let exactShelf = choseTheShelf(req)
  
  await exactShelf.find({}, function (err, products) {
    assert.equal(err, null);
    return products
  })
  .then(products => {
    res.send(products);
  })
}

module.exports.findOneOnTheShelf = async (req, res) => {    // use it
  if (!req.session.i)
    req.session.i = 0;
  ++req.session.i;
  
  
  console.log('======================2. req.sessionID = ', req.sessionID)
  
  let exactShelf = choseTheShelf(req)
  let convertedId = new mongoose.Types.ObjectId(req.params._id)
  
  await exactShelf.findOne({_id: convertedId}, function (err, product) {
    assert.equal(err, null);
    return product
  })
  .then(product => res.send(product))
}



// Запрос at gridMongoDb для ПЛУЧЕНИЯ и УДАЛЕНИЯ из gridMongoDb отдельных файлов/изображений.
//A. Создаем stream to GridFsStorage at mongoDb.
//А1. Создаем mongoose-connection с db.
//mongoose.connect - используем старый.
const gridConnect = mongoose.createConnection(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });   //url = "mongodb://api_db:27017/api"
console.log(' ====== mongoose.connections.length = ', mongoose.connections.length)   //количество connection у connect'a.


//A2. Создаем gfs - это stream to gridMongoDb для ПЛУЧЕНИЯ и УДАЛЕНИЯ из gridMongoDb отдельных файлов/изображений.
let gfs;
gridConnect.once('open', () => {
  gfs = Grid(gridConnect.db, mongoose.mongo)
  // gfs.collection('uploads')   //если это указываем, то надо прописывать gfs.remove({filename: imgName, root: 'uploads' }, ...){} ghb удалении файлов(!)
});


//B. Роуты для GridFsStorage
module.exports.getOneImgFromGridStorageForPicture = async (req, res) => {   //async ??, ведь gfs- не промис. ??
  let imgName = req.params.imgname
  
  gfs.files.findOne({filename: imgName}, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No files available'
      })
    } else {
      const readstream = gfs.createReadStream(file.filename);    //<< для последующего выведения файла как картинки.
      readstream.pipe(res)
    }
  })
}

module.exports.getAllGridFiles = async (req, res) => {
  gfs.files.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(200).json({
        success: false,
        message: 'No files available'
      })
    } else {
      console.log('==========getAllGridFiles = ', files)
      res.status(200).send(files)
    }
  });
}

module.exports.getOneGridFile = async (req, res) => {
  let name = req.params.name
  
  gfs.files.findOne({filename: name},(err, file) => {
    if (!file) {
      return res.status(200).json({
        success: false,
        message: 'No file available'
      })
    } else {
      res.status(200).send(file)
    }
  });
}

module.exports.delOneGridFile = async (req, res) => {
  let name = req.params.name
  
  // gfs.remove({filename: imgName, root: 'uploads' }, (err, gridStore) => {  // root: 'uploads' - писать важно, если заявляем выше "gfs.collection('uploads')"(!).
  gfs.remove({filename: name}, (err, gridStore) => {  // root: 'uploads' - писать важно(!).
    if (err) {
      return res.status(404).json({ err: err });
    }
    console.log(`============ delOneGridFile ${name} - successfully`)
  })
}








//Роуты для diskStorage
const diskStoragePath = ROOT_PATH + 'initialData/';      //ROOT_PATH = "/usr/src/app/"

//для <img>, sendFile().
module.exports.getOneImgFromDiskStorageForPicture = async (req, res) => {  // = us it
  let shelf = req.params.shelf
  let imgName = req.params.imgName
  res.sendFile(diskStoragePath + 'imgs/' + shelf + '/' + imgName)  //высылаем файлом, без createReadStream (как в случае с GridFsStorage).
}

module.exports.getAllDiskFilesName = (req, res) => {
  res.send(fs.readdirSync(diskStoragePath));     // высылаем список ИМЕН файлов, присутствующих в папке, send()
}

module.exports.getOneDiskFile = async (req, res) => {
  let name = req.params.name
  res.sendFile(diskStoragePath + name)         //высылаем ТЕКСТОВОЙ Файл, и он распечатывается в броузере.
}

module.exports.delOneDiskFile = async (req, res) => {
  let name = req.params.name
  fs.unlink(diskStoragePath + name, (err) => {
    if (err) {
      console.error(err)
      return
    }
  })
  res.end(`delOneDiskFile ${name} - successfully`)
}