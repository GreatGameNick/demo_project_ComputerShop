export default class AuthUtils {
  static pullOutAccessTokenBody (accessToken) {
    let tokenParts = accessToken.split(' ')[1].split('.')
    return JSON.parse(Buffer.from(tokenParts[1], 'base64').toString('utf8'))
  }
  
  //в хедер запросов, у которых url содержит "auth", добавляем accessToken
  static attachAccessTokenToHeader(accessToken, config) {
    if (accessToken && config.url.includes('auth')) {
      config.headers.accesstoken = accessToken //accessToken мы получаем на сервере как req.headers.accesstoken. Ключи у хедера надо писать МАЛЕНЬКИМИ буквами, но тире - допустимы.
    } else {                                   // или хедер можно заявлять так: headers['Access-Token']
      delete config.headers.accesstoken
    }
    return config
  }
  
}

