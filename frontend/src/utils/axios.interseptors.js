import store from '../store'
import axios from "axios"
import AuthUtils from './auth.utils'
//https://qna.habr.com/q/519691

//1. Валидация access-токина.
const treatAccessTokenInterceptor = store => async config => {
  let accessToken = store.getters.GET_ACCESS_TOKEN
  
  //если запрос - не к "/auth", то всё - пропускаем, в хедер токен не прикрепляем.
  //если обращение к 'auth' - первичное (запрос на аутентификацию - только отправляем, токен еще не получен), то тоже пропускаем, в хеадер записывать еще нечего.
  if (!config.url.includes('auth') || !accessToken) {
    console.log('config.url "NO_/auth-path", "NO_accessToken" =====', config.url)
    return config
  }
  
  //иначе - проверяем accessToken на просроченность, только.
  
  // Сценарий честного поведения клиента - проверяем только просроченность access-токена.
  console.log('config.url "auth" =====', config.url)
  let tokenRecoveryPromise = null
  let tokenExp = AuthUtils.pullOutAccessTokenBody.exp   //exp берем из дешифрованного тела токена { login: '(999) 999-99-99', exp: 1622532886941 }
  
  //если accessToken просрочен => восстанавливаем его
  if (Date.now() > tokenExp) {
    //посылаем запрос для восстановления access-токена с помощью refresh-токена,
    //в результате запроса обновленный accessToken пропишеться в сторе.
    tokenRecoveryPromise = store.dispatch('TOUCH_ACCOUNT', {login: '', password: ''})   //for "восстановление accessToken'a через refreshToken"
    await tokenRecoveryPromise
    tokenRecoveryPromise = null
  
    //запрашиваем из Store ВОССТАНОВЛЕННЫЙ accessToken и прикрепляем его к хедеру запроса.
    accessToken = store.getters.GET_ACCESS_TOKEN
    console.log('treatAccessTokenInterceptor//восстановленный AccessToken в config"e =======', config)
    return AuthUtils.attachAccessTokenToHeader(accessToken, config)
  } else {
    //accessToken - непросроченный. Добавляем его в хедер запроса.
    return AuthUtils.attachAccessTokenToHeader(accessToken, config)
  }
}

export const treatAccessToken = treatAccessTokenInterceptor(store)

//2. На случай, когда в ответе приходит ошибка 401, нет авторизации.
const updateTokensInterceptor = (store, http) => async error => {
  let tokenRecoveryPromise = null
  console.log('error_for_response.data.message-1', error)
  console.log('error_for_response.data.message-2', error.config)   //СКРЫТОЕ(!) поле у error(!).
  console.log('error_for_response.data.message-3', error.response) //СКРЫТОЕ(!) поле у error(!).  =>
  //error.response = {
  //  config: {url: "auth/basket", method: "delete", headers: {…}, params: {…}, transformRequest: Array(1), …}
  //  data: "Unauthorized"
  //  headers: {connection: "keep-alive", content-length: "12", content-type: "text/plain; charset=utf-8", date: "Sun, 06 Jun 2021 10:29:33 GMT", etag: "W/\"c-dAuDFQrdjS3hezqxDTNgW7AOlYk\"", …}
  //  request: XMLHttpRequest {readyState: 4, timeout: 0, withCredentials: false, upload: XMLHttpRequestUpload, onreadystatechange: ƒ, …}
  //  status: 401
  //  statusText: "Unauthorized"
  //}
  
  
  //По уму, здесь надо дополнительно отрабатывать error.response.data.message,
  //но задавать его в ответе сервера мне не получилось.
  // if (!['Token_expired', 'Invalid_token'].includes(message)) {  //в случае, когда ошибка не связана с валидностью accessToken'a.
  //   return Promise.reject(error)
  // }
  
  if(error.response.status === 401) {
    //посылаем запрос для восстановления access-токена с помощью refresh-токена.
    console.log('updateTokensInterceptor - 401 ============')
    
    tokenRecoveryPromise = store.dispatch('TOUCH_ACCOUNT', {login: '', password: ''})
    await tokenRecoveryPromise
    tokenRecoveryPromise = null
    AuthUtils.attachAccessTokenToHeader(store.getters.GET_ACCESS_TOKEN, error.config)
  
    //заново повторяем неудавшийся запрос, но уже с восстановленным accessToken'ом.
    return http(error.config)
  }
}

export const updateTokens = updateTokensInterceptor(store, axios)








