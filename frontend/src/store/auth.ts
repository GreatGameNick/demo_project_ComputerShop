import {MutationTree, ActionTree, GetterTree} from 'vuex'
import {RootState} from '@/types'
import {AuthState, Authentication, Authorization} from "@/types/auth";
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
    async CREATE_AUTH({commit}, {login, password}: Authentication): Promise<Authorization> {
      await axios.post('/auth', {login, password})
        .then((response) => {
        })
      return Promise.resolve({
        isAuthorization: true,
        accessToken: 'eee',
        refreshToken: 'rrrr'
      })
    },
    async EXPECTATION_AUTH({commit}, {login, password}: Authentication): Promise<Authorization> {
      await axios.get('/auth', {params: {login, password}})
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





