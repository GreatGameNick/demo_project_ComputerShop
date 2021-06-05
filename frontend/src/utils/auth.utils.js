export const AuthUtils = class AuthService {
  static pullOutAccessTokenBody (accessToken) {
    let tokenParts = accessToken.split(' ')[1].split('.')
    return JSON.parse(Buffer.from(tokenParts[1], 'base64').toString('utf8'))
  }
}



