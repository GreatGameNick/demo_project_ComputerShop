const assert = require('assert');
const {authModel} = require("../models/auth")

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

module.exports.touchAccount = async (req, res) => {
  let login = req.body.login
  let password = req.body.password
  
  await authModel.findOne({login, password}, function (err, authData) {
    assert.equal(err, null);
    console.log(' ================= authModel.findOne', authData)
    
    return authData
  })
  .then(async authData => {
    if(authData == null) {       //если аккаунта нет, то создаем его.
      const newAccount = new authModel({
        login,
        password,
        accessToken: '',
        refreshToken: ''
      })
      await newAccount.save()
    }
    
    //генерируем токены
    
    res.send({
      accessToken: 'accessToken=',
      refreshToken: 'refreshToken=',
      userLogin: login
    })
  })
  
  
  
}

// module.exports.login = async (req, res) => {
//   let [login, password] = req.params.auth.split(';')
//
//   await authModel.findOne({login, password}, function (err, authenticationData) {
//     assert.equal(err, null);
//     return authenticationData
//   })
//   .then(auth => res.send({
//     isAuthorization: true,
//     accessToken: 'accessToken=',
//     refreshToken: 'refreshToken='
//   }))
//   .catch(console.log)
// }









