const mongoose = require("mongoose")
const assert = require('assert');
const fs = require('fs');

const {BasketModel} = require('../models/baskets')
const {ROOT_PATH, port, MONGO_URL, authApiUrl, mode} = require("../../configuration")

// putProductToBasket, deleteProductAtBasket, getBasket



module.exports.putProductToBasket = async (req, res) => {
  const basketInstance = new BasketModel({
    sessionID: req.sessionID,
    createdDate: Date.now(),
    baskettt: {
      shelf: req.body.shelf,
      _id: req.body._id
    }
  })

  await basketInstance.save()
  res.sendStatus(200)
}

module.exports.getBasket = async (req, res) => {
  await BasketModel.find({sessionID: req.sessionID}, function (err, basketPoints) {
    assert.equal(err, null);
    return basketPoints
  })
  .then(basketPoints => {
    console.log('basketPoints ============= ', basketPoints)
    res.send(basketPoints)
  })
}



// module.exports.findOneOnTheShelf = async (req, res) => {    // use it
//   if (!req.session.i)
//     req.session.i = 0;
//   ++req.session.i;
//
//   let exactShelf = choseTheShelf(req)
//   let convertedId = new mongoose.Types.ObjectId(req.params._id)
//
//   await exactShelf.findOne({_id: convertedId}, function (err, product) {
//     assert.equal(err, null);
//     return product
//   })
//   .then(product => res.send(product))
// }









