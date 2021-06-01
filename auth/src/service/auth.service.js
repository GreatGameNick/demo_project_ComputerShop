const crypto = require('crypto')

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
    return crypto.randomBytes(20).toString('base64').replace(/\W/g, '')
  }
  
  //проверка ликвидности accessToken'a - деформированность, просроченность
  static checkAccessTokenforSolid(accessToken) {  //accessToken = 'Bearer eyJhbGcI6Imp3dCJ9.Iig5OTkp05OS05OSI=./LkG6veVVaOpcPu3cUxe0='
    let tokenParts = accessToken
      .split(' ')[1]
      .split('.')
    
    //проверяем недеформированность токена - хеадер и тело продолжают формировать такую же подпись, которой и подписан токен
    let signature = crypto
      .createHmac('SHA256', accessTokenKey)
      .update(`${tokenParts[0]}.${tokenParts[1]}`)
      .digest('base64')
    
    let body = ''
    if (signature === tokenParts[2])
      body = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString('utf8'))   //получаем обратно дешифрованное тело токена { login: '(999) 999-99-99', exp: 1622532886941 }
    else
      return null     //'accessTokenIsWrong'
    
    //проверяем непросроченность токена
    if (Date.now() < body.exp)
      return null    //'accessTokenIsDied'
    
    return body
  }
}


// # axios- запросы, что бы куки отправлялись.
// axios.get('url', {withCredentials: true})
