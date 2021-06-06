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



//for LOGIN, LOGOUT(when "password: false", а req.is_authorization = true) & create_account concurrently AND
//for "восстановление accessToken'a через refreshToken" (в pl запроса будет {login: '', password: ''}).
module.exports.touchAccount = async (req, res) => {
  let password, filter
  let login = req.body.login   // при LOGIN, LOGOUT & create_account - имеет значение, при "восстановлении accessToken'a" - login = ''.
  let sessionID = req.sessionID
  let currentRefreshToken = ''
  
  //a. for LOGIN, LOGOUT & create_account.
  // Аккаунт ищем по значению login & password.
  // req.is_authorization задается в express/index.js/app.use().
  if (!req.is_authorization) {
    password = req.body.password
    
    //формируем фильтр для поиска аккаунта
    filter = {login}         //filter = {login: login, password: password}, причем поле "password" может отсутствовать.
    if (password)            //если password=false, то здесь имеет место LOGOUT, ищем аккаунт без проверки паспорта.
      filter.password = req.body.password
  } else {
    //b. for refreshing token.
    // Аккаунт ищем по значению refreshToken'a.
    currentRefreshToken = AuthService.separateCookie(req.headers.cookie, 'refreshToken')
    
    if (currentRefreshToken) {
      filter = {refreshToken: currentRefreshToken}  //фильтром для отбора аккаунта будет не логин, а refreshToken
    }
    else {
      res.redirect('/a11n')
      return
    }
  }
  
  console.log('FILTER for find account =======', filter)
  
  //обращаемся к аккаунту
  await authModel.findOne(filter, function (err, account) {
    assert.equal(err, null);
    return account
  })
    .then(async account => {
      console.log('account =======', account)
      
      //в случае, когда речь идет о заходе в аккаунт для восстановления accessToken'a, проверяем непросроченность refreshToken'a и его идентичность эталонному
      if(req.is_authorization && currentRefreshToken) {
        let currentRefreshTokenValid = AuthService.checkRefreshToken(account.refreshToken, currentRefreshToken)
        
        if(!currentRefreshTokenValid) {  //currentRefreshToken невалидный
          res.redirect('/a11n').end()
          return
        }
      }
      
      let accessToken = (password || currentRefreshToken) ? AuthService.createAccessToken(login) : ''  //присуждаем значение только при login(будет присутствовать паспорт), а при logout - обнуляем их.
      let refreshToken = (password || currentRefreshToken) ? AuthService.createRefreshToken() : ''
      
      if ((account == null) && !currentRefreshToken) {       //если аккаунта нет(и это - не восстановление токенов), то создаем его, вписав в него токены.
        account = new authModel({
          login,
          password,
          accessToken,
          refreshToken,
          userData: {
            basket: []
          }
        })
      } else {        //если аккаунт есть, то обновляем аккаунт, вписав в него токены.
        account.accessToken = accessToken
        account.refreshToken = refreshToken
      }
      
      //добавляем СЕССИОННУЮ КОРЗИНУ в аккаунтную корзину,
      //exactly for LOGIN & create_account (в этом случае будет присутствовать password), а так же при восстановлении просроченного токена.
      //sessionID добавлено в условие для подстраховки, ибо далее мы забираем сессионную корзину, опираясь на именно sessionID.
      if ((password || currentRefreshToken) && sessionID) {
        await retrieveSessionBasket(sessionID)
          .then(retrievedBasket => {
            account.userData.basket.push(...retrievedBasket.basketPoints)
          })
      }
      
      //сохраняем изменения аккаунта
      await account.save(function (err, account) {
        if (err) throw err;
      })
      
      // генерируем refreshToken-куку
      res.cookie('refreshToken', refreshToken, {
        // maxAge: 3600000 * 24,                                          // 3600000ms * 24 = 24 часа
        expires: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),   //формат 2021-03-25T09:53:13.067Z
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        // path: '/auth'
      })
      
      
      //когда происходит рефреш токенов мы это обозначаем для отработки этой части респонса в axios-интерсепторе на клиенте.
      let isRefreshing = false
      
      if(currentRefreshToken)
        isRefreshing = true
      
      //RESPONSE
      //сообщаем accessToken,
      //возвращаем обновленную корзину: сессионная + аккаунтная корзины, а при logout - возвращаем пустой [].
      res.send({
        isRefreshing,
        login,
        accessToken,       //КАК этот ответ воспримиться при восстановлении токенов ???????????
        userData: {
          basket: password ? account.userData.basket : []
        }
      })
    })
    .catch(error => {   //ошибка при поиске аккаунта.
      console.log('error_during_the_finding_account = ', error)
      res.redirect('/a11n')
    })
}

