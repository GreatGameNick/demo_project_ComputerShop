const assert = require('assert')
const {BasketModel} = require('../models/baskets')

module.exports.getBasket = async (req, res) => {
  console.log('basket <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<')

  if (!req.session.i)
    req.session.i = 0;
  ++req.session.i;

  console.log('=====findAll_OnTheShelf. req.sessionID = ', req.sessionID)

  // await BasketModel.findOne({sessionID: req.sessionID}, function (err, basket) {
  //   assert.equal(err, null);
  //   return basket
  // })
  // .then(basket => basket == null ? res.send('basket is empty') : res.send(basket))  //надо ПРОВЕРИТЬ ПУТЬ СРАБАТЫВАНИЯ 'basket is empty'(!)
}

module.exports.putProductToBasket = async (req, res) => {
  await BasketModel.findOne({sessionID: req.sessionID}, function (err, basket) {
    assert.equal(err, null);
    return basket
  })
  .then(async basket => {
    if (!basket) {
      const basketInstance = new BasketModel({
        sessionID: req.sessionID,
        createdDate: Date.now(),
        basketPoints: [{
          shelf: req.body.shelf,
          _id: req.body._id
        }]
      })
      await basketInstance.save()
    } else {
      basket.basketPoints.push({shelf: req.body.shelf, _id: req.body._id})
      await BasketModel.updateOne({sessionID: req.sessionID}, {basketPoints: basket.basketPoints}, function (err, res) {
        console.log(err)
      })
    }
  })
  res.sendStatus(200)
}

module.exports.deleteProductAtBasket = async (req, res) => {
  await BasketModel.findOne({sessionID: req.sessionID}, function (err, basket) {
    assert.equal(err, null);
    return basket
  })
  .then(async basket => {
    if (req.query._id === 'all') {
      basket.basketPoints = []
    } else {
      let productPointIndex = basket.basketPoints.findIndex(item => item._id.toString() === req.query._id)
      if (productPointIndex > -1)
        basket.basketPoints.splice(productPointIndex, 1)
    }
    
    await BasketModel.updateOne({sessionID: req.sessionID}, {basketPoints: basket.basketPoints}, function (err, res) {
      console.log(err)
    })
  })
  .catch(error => {
    console.log('deleteProductAtBasket ====== ', error)
  })
  
  res.sendStatus(200)
}


//переделать
module.exports.retrieveSessionBasket = async (req, res) => {
  let sessionID = req.params.sessionID
  
  await BasketModel.findOneAndDelete({sessionID: sessionID}, function (err, basket) {   //findOneAndDelete, в отличии от findOne, НЕ ПРОМИС(!). Then()- не сработает(!).
    if (err) console.log(err)
    res.send(basket)
  })
}




