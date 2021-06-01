const cookieParser = require('cookie-parser')
const axios = require('axios')
const assert = require('assert')
const {authModel} = require('../models/auth')
const {AuthService} = require('../../service/auth.service')
const {apiUrl} = require('../../configuration')

const {retrieveSessionBasket} = require('./baskets')

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

module.exports.touchAccount = async (req, res) => {  //for LOGIN, LOGOUT(when "password: false") & create_account concurrently
  let login, password, sessionID, filter
  
  if(req.body.login) {   //a. for LOGIN, LOGOUT & create_account
    login = req.body.login
    password = req.body.password
    sessionID = cookieParser.signedCookie(req.body.connectSidCookie, 'Nick')
  
  //формируем фильтр для поиска аккаунта
  filter = {login}      //filter = {login: login, password: password}, причем поле "password" может отсутствовать.
  if (password)            //если password=false, то здесь имеет место LOGOUT, ищем аккаунт без проверки паспорта.
    filter.password = req.body.password
  } else {             //b. for refreshing token. Аккаунт ищем по значению refreshToken'a.
    let refreshToken = req.headers.cookie.split(';')     //или  req.cookies ???
    
    
    
    
    filter = {refreshToken: AuthService.separateRefreshTokenFromCookies}  //refreshToken, отделяем RefreshToken из куков хедера
  }

  //обращаемся к аккаунту
  await authModel.findOne(filter, function (err, account) {
    assert.equal(err, null);
    return account
  })
    .then(async account => {
      let accessToken = password ? AuthService.createAccessToken(login) : ''  //присуждаем значение только при login, а при logout - обнуляем их.
      let refreshToken = password ? AuthService.createRefreshToken() : ''
      
      if (account == null) {       //если аккаунта нет, то создаем его, вписав в него токены.
        account = new authModel({
          login,
          password,
          accessToken,
          refreshToken,
          userData: {
            basket: []
          }
        })
      } else {        //если аккаунт есть, то обновляем аккаунт, вписав в него токены, И обновляем аккаунтную корзину, добавив в нее СЕССИОННУЮ КОРЗИНУ.
        account.accessToken = accessToken
        account.refreshToken = refreshToken
      }
      
      //добавляем СЕССИОННУЮ КОРЗИНУ в аккаунтную корзину,
      //exactly for LOGIN & create_account
      if (password) {
        await retrieveSessionBasket(sessionID)
          .then(retrievedBasket => {
            account.userData.basket.push(...retrievedBasket.basketPoints)
          })
      }
      
      //очищаем но НЕ удаляем сессионную корзину.
      //проверить, если это не так - дописать.
      
      
      //сохраняем изменения аккаунта
      await account.save(function (err, account) {
        if (err) throw err;
      })
      
      // генерируем refreshToken-куку
      res.cookie('refreshToken', refreshToken, {
        // maxAge: 3600000 * 24,                                // 3600000ms * 24 = 24 часа
        expires: new Date(Date.now() + 86400000),         //формат 2021-03-25T09:53:13.067Z
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        // path: '/auth/authentication'     //or '/authentication' ???. Скорее всего - '/auth/authentication'.
      })
      
      // возвращаем пользователю обновленную корзину: сессионная + аккаунтная корзины, а при logout - возвращаем пустой [].
      res.send({
        login,
        accessToken,
        userData: {
          basket: password ? account.userData.basket : []
        }
      })
    })
}

