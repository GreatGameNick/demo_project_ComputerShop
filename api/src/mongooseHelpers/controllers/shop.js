const mongoose = require("mongoose")
const Grid = require('gridfs-stream')
const assert = require('assert')
const fs = require('fs')

const {laptops, mouses, accessories} = require('../models/shelves')
const {ROOT_PATH, port, MONGO_URL, authApiUrl, mode} = require("../../configuration")
const {errorProduct} = require('../../../initialData/errorProduct')


//Текстовые роуты для MongoDb.
function choseTheShelf(req) {
  switch (req.params.shelf) {
    case "laptops":
      return laptops
    case "mouses":
      return mouses
    case "accessories":
      return accessories
  }
}

module.exports.findAllOnTheShelf = async (req, res) => {
  let exactShelf = choseTheShelf(req)
  
  await exactShelf.find({}, function (err, products) {
    assert.equal(err, null);
    return products
  })
  .then(products => {
    res.send(products)
  })
}

module.exports.findOneOnTheShelf = async (req, res) => {
  let exactShelf = choseTheShelf(req)
  let convertedId = new mongoose.Types.ObjectId(req.params._id)
  
  await exactShelf.findOne({_id: convertedId}, function (err, product) {
    assert.equal(err, null)
    return product
  })
  .then(product => {
    if (product) {
      res.send(product)
    } else {
      //Этот код требуется согласно целям ДЕМОНСТРАЦИОННОГО проекта, причем он актуален только в режиме DEV-разаработки exactly.
      //
      // Когда мы перезагружаем броузер, находясь на странице Корзина, и при этом перезагружаем и сервер,
      //(причем перезагружается не весь сервер, а только api-сервис, mongoDb - не обнуляется),
      //происходит перезагрузка initialData to mongoDb.
      //
      //По этой причине у всех продуктов в mongoDb ИЗМЕНЯЕТСЯ их _id.
      //Между тем ссылки Корзины в mongoDb остаются неизменными.
      //
      //В результате по запросу товара (со старым _id) никакого товара в mongoDb не находим.
      //
      //Для исправления требуется удалить из броузера сессионную cookie, перезагрузить в броузере домашнюю страницу сайта и сформировать корзину заново.
      errorProduct._id = req.params._id
      res.send(errorProduct)
    }
  })
}


//Роут для diskStorage, для запроса <img>.
//Использую diskStorage сразу и только для считки.
//ROOT_PATH = "/usr/src/app/"
module.exports.getOneImgFromDiskStorageForPicture = async (req, res) => {
  let shelf = req.params.shelf
  let imgName = req.params.imgName
  res.sendFile(`${ROOT_PATH}initialData/imgs/${shelf}/${imgName}`)  //используем команду sendFile()(!), высылаем файлом, без createReadStream (как в случае с GridFsStorage).
}
