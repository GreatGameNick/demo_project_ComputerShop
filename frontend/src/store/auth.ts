import {MutationTree, ActionTree, GetterTree} from 'vuex'
import {RootState} from '@/types'
import {AuthState, Authentication, AuthData} from "@/types/auth"
import axios from "axios"

export default {
  namespaced: false,
  state: {
    userLogin: '',
    isAuthorization: false,           //для интерфейса Vue-проекта
    accessTokenClosure: null,         //для авторизации. Замыкание, в котором сохраняется accessToken.
  } as AuthState,
  getters: {
    GET_USER_LOGIN: state => state.userLogin,
    GET_IS_AUTHORIZATION: state => state.isAuthorization,
    GET_ACCESS_TOKEN: state => {
      if(state.accessTokenClosure != null)
        return state.accessTokenClosure()    //возвращаем accessToken из замыкания.
      return null
    }
  } as GetterTree<AuthState, RootState>,
  mutations: {
    SET_AUTH: (state, data: AuthData) => {     //for LOGIN, LOGOUT & create_account concurrently
      state.userLogin = data.accessToken ? data.userLogin : ''
      state.isAuthorization = data.accessToken !== ''    // false/true
      
      function closure(token: string) {     //сохраняем accessToken в замыкании
        return function() {
          return token
        }
      }
      state.accessTokenClosure = data.accessToken ? closure(data.accessToken) : null
    }
  } as MutationTree<AuthState>,
  actions: {
    async TOUCH_ACCOUNT({commit}, {login, password}: Authentication): Promise<AuthData> {    //for LOGIN, LOGOUT & create_account concurrently
      function getCookie (name: String): String {
        let matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
        return matches ? decodeURIComponent(matches[1]) : ''
      }
      console.log('getCookie ====', getCookie('connect.sid'))
      
      //мы обращаемся к серверу auth-сервиса, но к нему с помощью куки не будет посылаться connect.sid, ибо он предназначен ДЛЯ api-сервиса.
      //поэтому забираем значение куки - из броузера, и шлем connect.sid-куку via pl для auth-сервиса.
      //connect.sid потребуется auth-сервису, когда он будет забирать из api-сервиса сессионную корзину.
      return await axios.post('auth/authentication', {login, password, connectSidCookie: getCookie('connect.sid')})      //обращаемся к auth-сервису докера через Nginx (а не к auth-сервису напрямую).
        .then(({data}) => {                                                                                                         //data = {login, accessToken, userData}
          commit('SET_AUTH', {accessToken: data.accessToken, userLogin: data.login})
          commit('SET_BASKET', data.userData.basket)
          return data
        })
    }
  } as ActionTree<AuthState, RootState>
}

