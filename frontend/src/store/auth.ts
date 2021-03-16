import {MutationTree, ActionTree, GetterTree} from 'vuex'
import {RootState} from '@/types'
import {AuthState, Authentication, Authorization} from "@/types/auth";
import axios from "axios";

export default {
  namespaced: false,
  state: {
    userLogin: '',
    userName: 'Kola',
    userStatus: 'cool',
    userData: '016',
    isAuthorization: false,
    accessToken: '',
    refreshToken: ''
  } as AuthState,
  getters: {
    GET_USER_LOGIN: store => store.userLogin,
    GET_IS_AUTHORIZATION:store => store.isAuthorization,
  } as GetterTree<AuthState, RootState>,
  mutations: {
    SET_AUTHORISATION(state, authorization: Authorization) {
      state.isAuthorization = authorization.isAuthorization
      state.accessToken = authorization.accessToken
      state.refreshToken = authorization.refreshToken
    },
    SET_USER_LOGIN(state, login: string) {
      state.userLogin = login
    },
    LOGOUT: state => {
      state.userLogin = ''
      state.userName = ''
      state.userStatus = ''
      state.userData = ''
      state.isAuthorization = false
    }
  } as MutationTree<AuthState>,
  actions: {
    async CREATE_ACCOUNT({commit}, {login, password}: Authentication): Promise<Authorization> {
      return await axios.post('api/authentication', {login, password})    //обращаемся к API-сервису докера через Nginx (а не напрямую).
        .then(({data}) => {
          console.log('DATA - CREATE_ACCOUNT ==============', data)
          commit('SET_AUTHORISATION', data)
          return data
        })
    },
    async LOGIN({commit}, {login, password}: Authentication): Promise<Authorization> {
      return await axios.get(`api/authentication/${login + ";" + password}`)
        .then(({data}) => {
          commit('SET_AUTHORISATION', data)
          commit('SET_USER_LOGIN', login)
          return data
        })
    },
    LOGOUT({commit}) {
      commit('LOGOUT')
      //удаление токенов
    }
  } as ActionTree<AuthState, RootState>
}





