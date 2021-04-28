const axios = require("axios")
const {authApiUrl} = require("../../configuration")
const {BasketModel} = require('../models/baskets')
const {retrieveSessionBasket_method} = require('./baskets')

module.exports.checkIsLogin = async (req, res) => {
  let login = req.params.login
  
  await axios.get(authApiUrl + `/identification/${login}`)   // http://auth:3002/api + /identification/${login}. Это запрос НЕ через Nginx, а напрямую по докер-сети.
  .then(({data}) => {                                           //Поэтому роут в auth/src/index.js обозначен как "/api/identification/:login".
    res.send(data)
  })
  .catch(console.log)
}

module.exports.touchAccount = async (req, res) => {   //for LOGIN, LOGOUT(when "password: false") & create_account concurrently
  await axios.post(authApiUrl + `/authentication`, {authData: req.body, sessionID: req.sessionID})
  .then(async ({data}) => {                       //data = {accessToken, refreshToken, userLogin, basket }
    //1. генерируем куку from data.refreshToken
    res.cookie('refreshToken', data.refreshToken, {
      // maxAge: 3600000 * 24,                                // 3600000ms * 24 = 24 часа
      expires: new Date(Date.now() + 86400000),         //формат 2021-03-25T09:53:13.067Z
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      // path: '/api/authentication'     //or '/authentication' ???
    })
    
    //2. возвращаем клиенту accessToken, личные данные аккаунта и обновленную корзину.
    res.send({userLogin: data.login, accessToken: data.accessToken, userData: data.userData})
    
  })
  .catch(console.log)
}



