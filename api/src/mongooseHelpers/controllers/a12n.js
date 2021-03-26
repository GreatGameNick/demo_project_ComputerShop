const axios = require("axios")
const {authApiUrl} = require("../../configuration")

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
  .then(({data}) => {
    console.log(' ============ api=Account', data)
    
    //генерируем куку from data.refreshToken
    res.cookie('refreshToken', data.refreshToken, {
      // maxAge: 3600000 * 24,                        // 3600000ms * 24 = 24 часа
      expires: new Date(Date.now() + 86400000),   //работает, формат 2021-03-25T09:53:13.067Z
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      // path: '/api/authentication'     //or '/authentication' ???
    })
    res.send({userLogin: data.userLogin, accessToken: data.accessToken})
  })
  .catch(console.log)
}


