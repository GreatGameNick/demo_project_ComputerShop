import Vue from 'vue'
import Vuex from 'vuex'
import {RootState} from '@/types'
import shopState from './shop'
import authState from './auth'
import basketState from './basket'

Vue.use(Vuex)

const state = () => ({
}) as RootState

export default new Vuex.Store<RootState>({
  state,
  modules: {
    shopState,
    authState,
    basketState
  }
})




