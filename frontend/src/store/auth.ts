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
    GET_USER_LOGIN: ({userLogin}): string => userLogin,
    GET_IS_AUTHORIZATION: ({isAuthorization}): boolean => isAuthorization,
    GET_ACCESS_TOKEN: (state): string => {
      if(state.accessTokenClosure != null)
        return state.accessTokenClosure()    //возвращаем accessToken из замыкания.
      return ''
    }
  } as GetterTree<AuthState, RootState>,
  mutations: {
    SET_AUTH: (state, data: AuthData): void => {     //for LOGIN, LOGOUT & create_account concurrently
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
    //for LOGIN, LOGOUT & create_account concurrently AND
    //for "восстановление accessToken'a через refreshToken"(в pl запроса будет {login: '', password: ''}).
    async TOUCH_ACCOUNT({commit}, {login, password}: Authentication): Promise<AuthData> {
      return await axios.post('auth/authentication', {login, password})      //обращаемся к auth-сервису докера через Nginx (а не к auth-сервису напрямую).
        .then(({data}) => {                                                                                               //data = {login, accessToken, userData}
          commit('SET_AUTH', {accessToken: data.accessToken, userLogin: data.login})
          commit('SET_BASKET', data.userData.basket)
          return data   //не востребован. Нужен только, что бы тайпскрипт не выпендривался. ))
        })
    }
  } as ActionTree<AuthState, RootState>
}

