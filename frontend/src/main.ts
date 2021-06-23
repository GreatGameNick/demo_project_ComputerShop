import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vuelidate from 'vuelidate'
import axios from "axios"
// @ts-ignore
import checkView from 'vue-check-view'
// @ts-ignore
import {treatAccessToken, updateTokens} from './utils/axios.interseptors.js'

Vue.config.productionTip = false
// @ts-ignore
Vue.use(Vuelidate)
Vue.use(checkView)

axios.interceptors.request.use(treatAccessToken)
axios.interceptors.response.use(response => response, updateTokens)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
