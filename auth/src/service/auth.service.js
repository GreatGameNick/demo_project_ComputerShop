const crypto = require('crypto')

let accessTokenKey = '1a2b-3c4d-5e6f-7g8h'

module.exports.AuthService = class AuthService {
  static createAccessToken(login) {
    let head = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'jwt' })).toString('base64')
    let body = Buffer.from(JSON.stringify(login)).toString('base64')
    
    let signature = crypto
    .createHmac('SHA256', accessTokenKey)
    .update(`${head}.${body}`)
    .digest('base64')
    
    return `Bearer ${head}.${body}.${signature}`
  }
  
  static createRefreshToken() {
    return crypto.randomBytes(20).toString('base64').replace(/\W/g, '')
  }
  
  static checkAccessToken(accessToken) {
  
  }
}




