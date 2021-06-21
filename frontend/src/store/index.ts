import Vue from 'vue'
import Vuex, {ActionTree, GetterTree, MutationTree} from 'vuex'
import {RootState} from '@/types'
import shopState from './shop'
import authState from './auth'
import basketState from './basket'
import {ShopState} from "@/types/shop";

Vue.use(Vuex)

const state = () => ({
  clarification: ''
}) as RootState

const getters = {
  GET_CLARIFICATION: ({clarification}) => clarification
} as GetterTree<RootState, RootState>

const mutations ={
  SET_CLARIFICATION: (state, message: string) => state.clarification = message
} as MutationTree<RootState>

const actions = {
  SHOW_CLARIFICATION({commit}, message: string): void {
    console.log('rr')
    commit('SET_CLARIFICATION', message)
    setTimeout(function () {
      commit('SET_CLARIFICATION', '')
    }, 5000)
  }
} as ActionTree<RootState, RootState>

export default new Vuex.Store<RootState>({
  state,
  mutations,
  actions,
  modules: {
    shopState,
    authState,
    basketState
  }
})




