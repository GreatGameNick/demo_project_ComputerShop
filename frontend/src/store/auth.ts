import {MutationTree, ActionTree, GetterTree} from 'vuex'
import {RootState} from '@/types'
import {ShopState} from "@/types/shop";
import {AuthState, AuthData, Token} from "@/types/auth";
import axios from "axios";

export default {
  namespaced: false,
  state: {
    token: ''
  } as AuthState,
  getters: {} as GetterTree<AuthState, RootState>,
  mutations: {},
  actions: {
    async CREATE_AUTH({commit}, {login, password}: AuthData): Promise<Token> {
      await axios.post('/auth', {login, password})
        .then((response) => {
        })
      return 'token'
    },
    async EXPECTATION_AUTH({commit}, {login, password}: AuthData): Promise<Token> {
      await axios.get('/auth', {params: {login, password}})
        .then((response) => {
        })
      return 'token'
    }
    
  } as ActionTree<AuthState, RootState>
}





