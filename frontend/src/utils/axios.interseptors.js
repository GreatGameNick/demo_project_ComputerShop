import store from '../store'
import axios from "axios"
import {AuthUtils} from './auth.utils'
//https://qna.habr.com/q/519691

//в хедер запросов, у которых url содержит "auth", добавляем accessToken
function attachAccessTokenToHeader(accessToken, config) {
  if (accessToken && config.url.includes('auth')) {
    config.headers.accesstoken = accessToken //accessToken мы получаем на сервере как req.headers.accesstoken. Ключи у хедера надо писать МАЛЕНЬКИМИ буквами, но тире - допустимы.
  } else {                                   // или хедер можно заявлять так: headers['Access-Token']
    delete config.headers.accesstoken
  }
  return config
}

//1.
const treatAccessTokenInterceptor = store => async config => {
  let accessToken = store.getters.GET_ACCESS_TOKEN
  
  //если запрос - не к "/auth", то всё - пропускаем, в хедер токен не прикрепляем.
  //если обращение к 'auth' - первичное, запрос на аутентификацию, токен еще не получен, то тоже пропускаем, в хеадер записывать еще нечего.
  if (!config.url.includes('auth') || !accessToken) {  //  отсутствие 'auth' в url.
    console.log('config.url NO_auth, NO_accessToken =====', config.url)
    return config
  }
  
  // Сценарий честного поведения клиента - проверяем только просроченность access-токена.
  console.log('config.url auth =====', config.url)
  let tokenRecoveryPromise = null
  let tokenExp = AuthUtils.pullOutAccessTokenBody.exp   //берем из дешифрованного тела токена { login: '(999) 999-99-99', exp: 1622532886941 }
  
  if (Date.now() > tokenExp) {     //'accessTokenIsDied' => восстанавливаем его
    //восстанавливаем accessToken
    tokenRecoveryPromise = store.dispatch('TOUCH_ACCOUNT', {login: '', password: ''})   //for "восстановление accessToken'a через refreshToken"
    await tokenRecoveryPromise
    tokenRecoveryPromise = null
  
    //запрашиваем из стора ВОССТАНОВЛЕННЫЙ accessToken и прикрепляем его к хедеру запроса.
    accessToken = store.getters.GET_ACCESS_TOKEN
    console.log('treatAccessTokenInterceptor//восстановленный AccessToken в config =======', config)
    return attachAccessTokenToHeader(accessToken, config)
  } else {
    //accessToken - непросроченный. Добавляем его в хедер запроса.
    return attachAccessTokenToHeader(accessToken, config)
  }
}

export const treatAccessToken = treatAccessTokenInterceptor(store)

//2.
const updateTokensInterceptor = (store, http) => async error => {
  let tokenRecoveryPromise = null
  console.log('error_for_response.data.message', error)
  console.log('error_for_response.data.message', error.config)
  
  
  // const message = get(error, 'response.data.message')    //<<<<<<<<<<<<<<<< дает ошибку
  
  // if (!['Token_expired', 'Invalid_token'].includes(message)) {  //в случае, когда ошибка не связана с валидностью accessToken'a.
  //   return Promise.reject(error)
  // }
  
  // tokenRecoveryPromise = store.dispatch('TOUCH_ACCOUNT', {login:'', password: ''})
  // await tokenRecoveryPromise
  //
  // tokenRecoveryPromise = null
  // attachAccessTokenToHeader(store.getters.GET_ACCESS_TOKEN, error.config)
  // return http(error.config)   //заново повторяем запрос, но уже с восстановленным accessToken'ом.
};

export const updateTokens = updateTokensInterceptor(store, axios)








