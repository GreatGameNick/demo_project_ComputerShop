import Vue from 'vue'
import Vuex, {ActionTree, GetterTree, MutationTree} from 'vuex'
import {RootState} from '@/types'
import shopState from './shop'
import authState from './auth'
import basketState from './basket'

Vue.use(Vuex)

const state = () => ({
  clarification: '',
  alertStuff: {
    slogan: '',
    suffix: '',
    yesFunction: null,
    functionArgument: null
  }
}) as RootState

const getters = {
  GET_CLARIFICATION: ({clarification}): string  => clarification,
  GET_ALERT: ({alertStuff}): any  => alertStuff
} as GetterTree<RootState, RootState>

const mutations ={
  SET_CLARIFICATION: (state, message) => state.clarification = message,
  SET_ALERT: (state, alertStuff) => state.alertStuff = alertStuff
} as MutationTree<RootState>

const actions = {
  SHOW_CLARIFICATION({commit}, message): void {
    commit('SET_CLARIFICATION', message)   //показываем пояснение
  },
  SHOW_ALERT({commit}, alertStuff): void {
    console.log('SHOW_ALERT')
    commit('SET_ALERT', alertStuff)   //показываем алерт
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




