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
    console.log(' ============ api=createAccount data', data)
    
    //генерируем куку из data.refreshToken
    
    res.send({userLogin: data.userLogin, accessToken: data.accessToken})
  })
  .catch(console.log)
}



