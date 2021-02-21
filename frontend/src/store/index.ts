import Vue from 'vue'
import Vuex from 'vuex'
import {MutationTree, ActionTree, GetterTree} from 'vuex'
import {RootState, Product, ProductPoint, BasketMovement, ProductsPoolForShelf} from '@/types';

import axios from "axios";

Vue.use(Vuex)

const state = () => ({
  laptops: [],
  mouses: [],
  accessories: [],
  clientBasket: [],
  isBasketProductsInTheStore: false,    //восстанавливались ли во Vuex после перезагрузки сайта описания продуктов, которые положены в корзину
  isBasketPointsInTheStore: false       //восстанавливались ли во Vuex после перезагрузки сайта сноски на продукты, которые положены в корзину. Важно, для нормальной работы в асинхронности.
}) as RootState

const getters = {
  // @ts-ignore
  GET_PRODUCTS: (state: RootState) => (shelf: string): Product [] => state[shelf],
  // @ts-ignore
  GET_PRODUCT: (state: RootState) => ({
                                        shelf,
                                        _id
                                      }: ProductPoint): Product => state[shelf].find(item => item._id === _id),  //| undefined
  GET_BASKET_POINTS: ({clientBasket}): ProductPoint[] => clientBasket,
  GET_IS_BASKET_PRODUCTS: ({isBasketProductsInTheStore}): boolean => isBasketProductsInTheStore,
  GET_IS_BASKET_POINTS: ({isBasketPointsInTheStore}): boolean => isBasketPointsInTheStore,
  GET_PRODUCT_BASKET_AMOUNT: ({clientBasket}) => ({shelf, _id}: ProductPoint): number => {
    let count = 0
    for (let item of clientBasket) {
      if (item._id === _id)
        count += 1
    }
    return count
  }
} as GetterTree<RootState, {}>

const mutations = {
  // @ts-ignore
  SET_PRODUCTS: (state, {shelf, products}: ProductsPoolForShelf) => state[shelf].push(...products),    //rown
  SET_BASKET: (state, recoveryBasket: ProductPoint[]) => state.clientBasket = recoveryBasket,
  SET_IS_BASKET_PRODUCTS: ({isBasketProductsInTheStore}, status: boolean) => isBasketProductsInTheStore = status,
  SET_IS_BASKET_POINTS: ({isBasketPointsInTheStore}, status: boolean) => isBasketPointsInTheStore = status,
  ADD_PRODUCT_TO_BASKET: ({clientBasket}, {shelf, _id}: ProductPoint) => clientBasket.push({shelf, _id}),
  DELETE_PRODUCT_AT_BASKET: ({clientBasket}, {shelf, _id}: ProductPoint) => {
    let deletedProductIndex = clientBasket.findIndex(itemId => itemId._id === _id)
    Vue.delete(clientBasket, deletedProductIndex)
  }
} as MutationTree<RootState>

const actions = {
  async FETCH_PRODUCTS({state, commit}, shelf: string): Promise<void> {  //грузим при посещении какой-либо полки Shop. Грузим сразу ВСЕ продукты.
    let basketShelfCounter = 0   //количество товаров, присутствующих в корзине с данной полки. Они могут быть уже загружены во Vuex (при посещении корзины).
    for (let product of state.clientBasket) {
      if (product.shelf === shelf)
        basketShelfCounter += 1
    }
    // @ts-ignore
    if (state[shelf].length <= basketShelfCounter)  //загружаем, если ранее - не загружали. Т.е. количество товаров на полке не больше, чем количество товаров, добавленных с данной полки в корзину.
      await axios.get(`/api/shop/${shelf}`)
        .then(data => commit('SET_PRODUCTS', {shelf, products: data.data}))
  },
  async FETCH_BASKET_POINTS({state, commit}): Promise<void> {     //грузим при загрузе App
    await axios.get(`/api/basket`)
      .then(recoveryBasket => {
        if (recoveryBasket.data !== 'basket is empty')
          commit('SET_BASKET', recoveryBasket.data.basketPoints)
        commit('SET_IS_BASKET_POINTS', true)
      })
  },
  async FETCH_BASKET_PRODUCTS({state, commit, dispatch}): Promise<void> {    //грузим при ПЕРВОМ посещении корзины. Восполняем товар, отсутствующий во Vuex.
    console.log('FETCH_BASKET_PRODUCTS ============')
    console.log('state.clientBasket.length =====1', state.clientBasket.length)
    
    if (!state.isBasketPointsInTheStore)  //для состояния, когда, находясь на странице Корзина, мы перезагружаем броузер. Ждем обновления BasketPointsInTheStore.
      await dispatch('FETCH_BASKET_POINTS')
    
    console.log('state.clientBasket.length =====2', state.clientBasket.length)
    
    if (state.clientBasket.length > 0) {
      console.log('if (state.clientBasket.length > 0) ============')
      
      //отбираем тот товар, который обозначен в корзине, но отсутствует во Vuex, (после перезагрузки сайта),
      //одновременно сортируя его по принадлежности к полкам.
      let upsetProducts = {} as any
      
      // for (let productPoint of state.clientBasket) {
      //   // @ts-ignore
      //   let isThere = state[productPoint.shelf].some(i => i._id === productPoint._id)
      //   if (!isThere) {
      //     if (upsetProducts[productPoint.shelf])   //если поле отсутствует, то создаем его.
      //       upsetProducts[productPoint.shelf] = []
      //     upsetProducts[productPoint.shelf].push(productPoint)
      //   }
      // }
      
      console.log('upsetProducts ============', upsetProducts)
      
      //дозагружаем недостающий товар
      
      // let shelves = Object.keys(upsetProducts)
      //
      // shelves.forEach(shelf => {
      //   upsetProducts[shelf].forEach((productPoint: ProductPoint) => {
      //     axios.get(`/api/shop/${productPoint.shelf}/${productPoint._id}`)
      //       .then((data) => {
      //         commit('SET_PRODUCTS', [data.data])
      //       })
      //   })
      // })
      
      // let basketShelves = Object.keys(upsetProducts)
      // for (let shelf of basketShelves) {
      //   let shelfResponses = upsetProducts[shelf].map((productPoint: ProductPoint) =>
      //     axios.get(`/api/shop/${productPoint.shelf}/${productPoint._id}`)
      //   )
      //   let responseData = await Promise.allSettled(shelfResponses)
      //   commit('SET_PRODUCTS', {shelf, products: responseData})
      // }
    }
    // commit('SET_IS_BASKET_PRODUCTS', true)
  },
  async MOVE_THE_BASKET_PRODUCT({state, commit}, {shelf, _id, vector}: BasketMovement) {
    if (vector > 0) {
      await axios.put(`/api/basket`, {shelf, _id})
        .then(response => {
          if (response.status === 200)
            commit('ADD_PRODUCT_TO_BASKET', {shelf, _id})
        })
    } else {
      await axios.delete(`/api/basket`, {params: {productPoint: {shelf, _id}}})
        .then(response => {
          if (response.status === 200)
            commit('DELETE_PRODUCT_AT_BASKET', {shelf, _id})
        })
    }
  }
} as ActionTree<RootState, {}>

export default new Vuex.Store<RootState>({
  state,
  getters,
  mutations,
  actions,
  modules: {}
})




