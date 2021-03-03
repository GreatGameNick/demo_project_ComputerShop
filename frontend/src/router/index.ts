import Vue from 'vue'
import VueRouter, {RouteConfig} from 'vue-router'
import Basket from '../views/Basket.vue'
import Auth from '../views/Auth.vue'
import Person from '../views/Person.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: '/laptops'
  },
  {
    path: '/basket',
    name: 'Basket',
    component: Basket
  },
  {
    path: '/login',
    name: 'Person',
    component: Person
  },
  {
    path: '/auth',
    name: 'Auth',
    component: Auth
  },
  {
    path: '/person',
    name: 'Person',
    component: Person
  },
  {
    path: '/:shelf',
    name: 'Shop',
    component:  () => import('../views/Shop.vue')
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
