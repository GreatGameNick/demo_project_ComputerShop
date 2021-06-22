import Vue from 'vue'
import Vuex, {ActionTree, GetterTree, MutationTree} from 'vuex'
import {RootState} from '@/types'
import shopState from './shop'
import authState from './auth'
import basketState from './basket'

Vue.use(Vuex)

const state = () => ({
  clarification: ''
}) as RootState

const getters = {
  GET_CLARIFICATION: ({clarification}): string  => clarification
} as GetterTree<RootState, RootState>

const mutations ={
  SET_CLARIFICATION: (state, message: string) => state.clarification = message
} as MutationTree<RootState>

const actions = {
  SHOW_CLARIFICATION({commit}, message: string): void {
    commit('SET_CLARIFICATION', message)   //показываем алерт
  }
} as ActionTree<RootState, RootState>

export default new Vuex.Store<RootState>({
  state,
  getters,
  mutations,
  actions,
  modules: {
    shopState,
    authState,
    basketState
  }
})




