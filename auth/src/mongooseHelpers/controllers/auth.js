const axios = require("axios")
const assert = require('assert');
const {authModel} = require('../models/auth')
const {AuthService} = require('../../service/auth.service')
const {apiUrl} = require("../../configuration")

module.exports.identification = async (req, res) => {
  let login = req.params.login
  
  await authModel.findOne({login: login}, function (err, login) {
    assert.equal(err, null);
    return login
  })
  .then(login => {
    if (login != null)
      res.send({isLogin: true})
    else
      res.send({isLogin: false})
  })
  .catch(console.log)
}

module.exports.touchAccount = async (req, res) => {   //for LOGIN, LOGOUT & create_account+LOGIN concurrently
  let login = req.body.authData.login
  let password = req.body.authData.password
  let sessionID = req.body.sessionID
  
  //формируем фильтр для поиска аккаунта
  let filter = {login}      //filter = {login: login, password: password}, причем поле "password" может отсутствовать.
  if (password)            //если password=false, то здесь имеет место LOGOUT, ищем аккаунт без проверки паспорта.
    filter.password = req.body.password
  
  //обращаемся к аккаунту
  await authModel.findOne(filter, function (err, account) {
    assert.equal(err, null);
    return account
  })
  .then(async account => {
    let accessToken = password ? AuthService.createAccessToken(login) : ''  //присуждаем значение только при login, не при logout.
    let refreshToken = password ? AuthService.createRefreshToken() : ''
    let basket = []
    
    if (account == null) {       //если аккаунта нет, то создаем его, вписав в него токены.
      account = new authModel({
        login,
        password,
        accessToken,
        refreshToken,
        basket: []
      })
    } else {        //если аккаунт есть, то обновляем аккаунт, вписав в него токены, И обновляем аккаунтную корзину, добавив в нее СЕССИОННУЮ КОРЗИНУ.
      account.accessToken = accessToken
      account.refreshToken = refreshToken
      
      console.log('account =================', account)
    }
    
    //добавляем СЕССИОННУЮ КОРЗИНУ в аккаунтную корзину
    // await axios.get(apiUrl + `/retrieveSessionBasket/${sessionID}`)
    // .then(async sessionBasket => {
    //   console.log('retrieveSessionBasket =================', sessionBasket)
    //   basket = account.basket.push(sessionBasket)
    // })
    
    //сохраняем изменения аккаунта
    account.save(function (err, account) {
      if (err) throw err;
    })
    
    res.send({
      login,
      accessToken,
      refreshToken,
      basket   //возвращаем пользователю обновленную корзину, сессионная + аккаунтная корзины.
    })
  })
}

