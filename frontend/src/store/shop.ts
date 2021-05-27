import Vue from 'vue'
import axios from "axios";
import {MutationTree, ActionTree, GetterTree} from 'vuex'
import {RootState} from '@/types/'
import {ShopState, Product, ProductsPoolForShelf} from '@/types/shop'
import {ProductPoint} from '@/types/user'

const state = () => ({
  laptops: [],
  mouses: [],
  accessories: []
}) as ShopState

const getters = {
  // @ts-ignore
  GET_PRODUCTS: (state: ShopState) => (shelf: string): Product[] => state[shelf],
  // @ts-ignore
  GET_PRODUCT: (state: ShopState) => ({shelf, _id}: ProductPoint): Product => state[shelf].find(item => item._id === _id),      // | undefined
} as GetterTree<ShopState, RootState>

const mutations = {
  // @ts-ignore
  SET_PRODUCTS: (state, {shelf, products}: ProductsPoolForShelf) => state[shelf].push(...products)
} as MutationTree<ShopState>

const actions = {
  async FETCH_PRODUCTS({state, commit, getters}, shelf: string): Promise<void> {  //грузим при посещении какой-либо полки Shop. Грузим сразу ВСЕ продукты.
    let basketShelfCounter = 1   //количество товаров, присутствующих в корзине на данной полке. Они могут быть уже загружены во Vuex (при посещении корзины) и поэтому не учитываться для оценки - "пустая ли" полка.
    for (let product of getters.GET_BASKET_POINTS) {
      if (product.shelf === shelf)
        basketShelfCounter += 1
    }
  
    // загружаем, если ранее - не загружали.
    // Т.е. если количество товаров на полке недостаточно - не больше, чем количество товаров, добавленных с данной полки в корзину,
    // или не больше 1шт, которая могла бы быть загружена при перезагрузке сайта, находясь на странице Отдельный продукт.
    // @ts-ignore
    if (state[shelf].length <= basketShelfCounter || state[shelf].length < 2)
      await axios.get(`/api/shop/${shelf}`)
        .then(data => commit('SET_PRODUCTS', {shelf, products: data.data}))
  },
  async FETCH_PRODUCT({state, commit}, {shelf, _id}: ProductPoint): Promise<Product> {
    let product = {} as Product
    
    await axios.get(`/api/shop/${shelf}/${_id}`)
      .then(data => {
        commit('SET_PRODUCTS', {shelf, products: [data.data]})
        product = data.data
      })
    return product
  }
} as ActionTree<ShopState, RootState>


export default {
  namespaced: false,
  state,
  getters,
  mutations,
  actions
}




