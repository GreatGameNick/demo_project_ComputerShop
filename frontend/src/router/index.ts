import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Shop from '../views/Shop.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: '/laptops'
  },
  {
    path: '/:shelf',
    name: 'Shop',
    component: Shop
  },
  {
    path: '/:shelf/:productId',
    name: 'Product',
    component: () => import('../views/Product.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
