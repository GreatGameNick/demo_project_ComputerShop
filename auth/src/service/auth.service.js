const crypto = require('crypto')

let BEARER = ''

module.exports.AuthService = class AuthService {
  static createAccessToken() {
  
  }
  
  // static setBearer(accessToken) {          //for headers.Authorization
  //   BEARER = `Bearer ${accessToken}`
  // }
  
  static createRefreshToken() {
    return crypto.randomBytes(20).toString('base64').replace(/\W/g, '')
  }
}




