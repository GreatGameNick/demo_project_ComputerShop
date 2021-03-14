import {MutationTree, ActionTree, GetterTree} from 'vuex'
import {RootState} from '@/types'
import {AuthState, AuthData, Token} from "@/types/auth";
import axios from "axios";

export default {
  namespaced: false,
  state: {
    userName: 'Kola',
    userStatus: 'cool',
    userData: '016'
  } as AuthState,
  getters: {} as GetterTree<AuthState, RootState>,
  mutations: {},
  actions: {
    async CREATE_AUTH({commit}, {login, password}: AuthData): Promise<Token> {
      await axios.post('/auth', {login, password})
        .then((response) => {
        })
      return Promise.resolve({
        accessToken: 'eee',
        refreshToken: 'rrrr'
      })
    },
    async EXPECTATION_AUTH({commit}, {login, password}: AuthData): Promise<Token> {
      await axios.get('/auth', {params: {login, password}})
        .then((response) => {
        })
      return Promise.resolve({
        accessToken: 'eee',
        refreshToken: 'rrrr'
      })
    }
    
  } as ActionTree<AuthState, RootState>
}





