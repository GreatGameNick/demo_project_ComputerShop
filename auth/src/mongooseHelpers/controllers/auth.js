const assert = require('assert');
const {authModel} = require("../models/auth")

module.exports.identification = async (req, res) => {
  let login = req.params.login
  
  await authModel.findOne({login: login}, function (err, login) {
    assert.equal(err, null);
    return login
  })
  .then(login => {
    if(login != null)
      res.send({isLogin: true})
    else
      res.send({isLogin: false})
  })
  .catch(console.log)
}

module.exports.createAccount = async (req, res) => {
  console.log('============= createAccount in auth/src/mongooseHelpers/controllers/auth.js')     //+
  console.log('===== req >>>>', req)
  
  // const newAccount = new authModel({
  //   login: req.body.login,
  //   password: req.body.password,
  //   isAuthorization: true,
  //   accessToken: '',
  //   refreshToken: ''
  // })
  // await newAccount.save()
  // res.send({
  //   isAuthorization: true,
  //   accessToken: 'accessToken=',
  //   refreshToken: 'refreshToken='
  // })
}









