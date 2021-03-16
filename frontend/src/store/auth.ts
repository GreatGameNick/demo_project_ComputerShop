import {MutationTree, ActionTree, GetterTree} from 'vuex'
import {RootState} from '@/types'
import {AuthState, Authentication, Authorization} from "@/types/auth";
import axios from "axios";

export default {
  namespaced: false,
  state: {
    userName: 'Kola',
    userStatus: 'cool',
    userData: '016',
    isAuthorization: false,
    accessToken: '',
    refreshToken: ''
  } as AuthState,
  getters: {
    GET_USER_DATA: store => store.isAuthorization
  } as GetterTree<AuthState, RootState>,
  mutations: {
    SET_AUTHORISATION(state, authorization: Authorization) {
      console.log('=========== SET_AUTHORISATION', authorization)
      
      state.isAuthorization = authorization.isAuthorization
      state.accessToken = authorization.accessToken
      state.refreshToken = authorization.refreshToken
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
    async EXPECTATION_ACCOUNT({commit}, {login, password}: Authentication): Promise<Authorization> {
      await axios.get('api/auth', {params: {login, password}})
        .then((response) => {
        })
      return Promise.resolve({
        isAuthorization: true,
        accessToken: 'eee',
        refreshToken: 'rrrr'
      })
    }
    
  } as ActionTree<AuthState, RootState>
}





