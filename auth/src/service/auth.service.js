const crypto = require('crypto')
const assert = require('assert')
const {authModel} = require('../mongooseHelpers/models/auth')

let accessTokenKey = '1a2b-3c4d-5e6f-7g8h'

module.exports.AuthService = class AuthService {
  static createAccessToken(login) {
    let head = Buffer.from(JSON.stringify({alg: 'HS256', typ: 'jwt'})).toString('base64')  //кодирование, но НЕ шифрование
    let body = Buffer.from(JSON.stringify(
      {
        login,
        exp: Date.now() + 30 * 60 * 1000   //+30min
      }
    )).toString('base64')        //кодирование, но НЕ шифрование
    
    let signature = crypto              //и кодирование, и шифрование
      .createHmac('SHA256', accessTokenKey)
      .update(`${head}.${body}`)
      .digest('base64')
    
    return `Bearer ${head}.${body}.${signature}`
  }
  
  
  static createRefreshToken() {
    return (Date.now() + 60 * 24 * 60 * 60 * 1000) + '.' + crypto.randomBytes(20).toString('base64').replace(/\W/g, '')
    //в роли разделителя можно использовать ТОЛЬКО точку. Другие знаки заменяются в хедере на '%', и далее поиск по идентичности - не проходит.
  }
  
  static pullOutAccessTokenBody (accessToken) {
    let tokenParts = accessToken.split(' ')[1].split('.')
    return JSON.parse(Buffer.from(tokenParts[1], 'base64').toString('utf8'))
  }
  
  
  //проверка ликвидности accessToken'a - его деформированность и просроченность
  static checkAccessTokenForSolid(accessToken) {  //accessToken = 'Bearer eyJhbGcI6Imp3dCJ9.Iig5OTkp05OS05OSI=./LkG6veVVaOpcPu3cUxe0='
    let tokenParts = accessToken.split(' ')[1].split('.')
    
    //проверяем недеформированность токена - хеадер и тело продолжают формировать такую же подпись, которой и подписан токен
    let signature = crypto
      .createHmac('SHA256', accessTokenKey)
      .update(`${tokenParts[0]}.${tokenParts[1]}`)
      .digest('base64')
    
    let body = ''
    if (signature === tokenParts[2])
      body = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString('utf8'))   //получаем дешифрованное тело токена { login: '(999) 999-99-99', exp: 1622532886941 }
    else
      return {login: '0', exp: body.exp}   //<<'accessTokenIsWrong'
    
    //проверяем непросроченность токена
    if (Date.now() > body.exp)
      return {login: body.login, exp: 0}   //<<'accessTokenIsDied'
    
    return body      //{login: '(999) 999-99-99', exp: 1622532886941} <<'accessTokenIsSolid'
  }
  
  //идентичность accessToken'a серверному аналогу  =>> true/false
  static async checkAccessTokenForMatch(accessToken, accessTokenBody) {   //accessTokenBody = { login: '(999) 999-99-99', exp: 1622543413881 }
    return await authModel.findOne({login: accessTokenBody.login}, function (err, account) {
      assert.equal(err, null);
      return account
    })
      .then(account => account.accessToken === accessToken)
  }
  
  static separateCookie(cookies, cookieName) {
    let cookieArray = cookies.split(';')
    
    for(let cookie of cookieArray) {
      let cookiePieces = cookie.trim().split('=')
      if(cookiePieces[0] === cookieName) {
        return  cookiePieces[1]
      }
    }
  }
  
  static isRefreshTokenAlive(refreshToken, oldRefreshToken) {  //проверка на просроченность токена
    return  oldRefreshToken.split('^')[0] > Date.now()
  }
  
  static checkRefreshToken(refreshToken, oldRefreshToken) {   //проверка на просроченность и иденитичность токена
    return this.isRefreshTokenAlive(refreshToken, oldRefreshToken) && (refreshToken === oldRefreshToken)
  }
}


// # axios- запросы, что бы куки отправлялись.
// axios.get('url', {withCredentials: true})
