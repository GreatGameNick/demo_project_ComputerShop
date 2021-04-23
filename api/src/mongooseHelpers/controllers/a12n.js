const axios = require("axios")
const {authApiUrl} = require("../../configuration")
const {BasketModel} = require('../models/baskets')

module.exports.checkIsLogin = async (req, res) => {
  let login = req.params.login
  
  await axios.get(authApiUrl + `/identification/${login}`)   // http://auth:3002/api + /identification/${login}. Это запрос НЕ через Nginx, а напрямую по докер-сети.
  .then(({data}) => {                                           //Поэтому роут в auth/src/index.js обозначен как "/api/identification/:login".
    res.send(data)
  })
  .catch(console.log)
}

module.exports.touchAccount = async (req, res) => {
  await axios.post(authApiUrl + `/authentication`, req.body)
  .then(async ({data}) => {
    //1. генерируем куку from data.refreshToken
    res.cookie('refreshToken', data.refreshToken, {
      // maxAge: 3600000 * 24,                                // 3600000ms * 24 = 24 часа
      expires: new Date(Date.now() + 86400000),         //формат 2021-03-25T09:53:13.067Z
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      // path: '/api/authentication'     //or '/authentication' ???
    })
    
    //2. сессионную корзину, привязанную к sessionId, переносим в личные данные аккаунта, ОБЪЕДИНЯЯ ее с уже имеющимися данными корзины в аккаунте,
    //корзину API_mongoDb, т.е. привязанную к sessionId, обнуляем,
    await BasketModel.findOne({sessionID: req.sessionID}, function (err, basket) {
      assert.equal(err, null);
      return basket
    })
    .then(async basket => {
      if (basket != null)
        await axios.put( `${authApiUrl}/${data.userLogin}/basket`, basket)
    })
    
    //очищаем сессионную корзину
    await
  
    //возвращаем клиенту accessToken, личные данные аккаунта и обновленную корзину.
    res.send({userLogin: data.userLogin, accessToken: data.accessToken, refreshBasket})          //'basket is empty'
    
  })
  .catch(console.log)
}



