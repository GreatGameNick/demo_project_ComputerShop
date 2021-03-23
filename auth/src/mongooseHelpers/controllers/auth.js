const assert = require('assert');
const {authModel} = require('../models/auth')
const {AuthService} = require('../../service/auth.service')

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
  
  await authModel.findOne({login, password}, function (err, account) {
    assert.equal(err, null);
    return account
  })
  .then(async account => {
    let accessToken = AuthService.createAccessToken()
    let refreshToken = AuthService.createRefreshToken()
  
    if(account == null) {       //если аккаунта нет, то создаем его, вписав в него токены.
      const newAccount = new authModel({
        login,
        password,
        accessToken,
        refreshToken
      })
      await newAccount.save()
    } else {                    //если аккаунт есть, то обновляем аккаунт, вписав в него токены.
      account.accessToken = accessToken
      account.refreshToken = refreshToken
      
      account.save(function (err, account) {
        if (err) throw err;
      })
    }
    res.send({
      accessToken,
      refreshToken,
      userLogin: login
    })
  })
}

