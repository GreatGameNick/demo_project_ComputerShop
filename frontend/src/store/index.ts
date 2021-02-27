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
  isBasketPointsInTheStore: false       //восстанавливались ли во Vuex после перезагрузки сайта сноски на продукты, которые положены в корзину. Важно, для нормальной работы в асинхронности при перезагрузке броузера.
}) as RootState

const getters = {
  // @ts-ignore
  GET_PRODUCTS: (state: RootState) => (shelf: string): Product[] => state[shelf],
  // @ts-ignore
  GET_PRODUCT: (state: RootState) => ({shelf, _id}: ProductPoint): Product => state[shelf].find(item => item._id === _id),  //| undefined
  GET_BASKET_POINTS: ({clientBasket}): ProductPoint[] => clientBasket,
  GET_BASKET_PRODUCTS: (state: RootState, getters): Product[] => {
    if(getters.GET_BASKET_POINTS.lengthb === 0)
      return []
    
    //устраняем в корзине повторы заказанных продуктов
    let noRedundantBasketProductPoints = getters.GET_BASKET_POINTS.filter((item: Product, ind: number, arr: Product[]) => ind === arr.findIndex(i => i._id === item._id))
    
    let basketProducts = [] as Product[]
    for (let productPoint of noRedundantBasketProductPoints) {
      // @ts-ignore
      let product = state[productPoint.shelf].find(item => item._id === productPoint._id)
      basketProducts.push(product)
    }
    return basketProducts
  },
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
  SET_PRODUCTS: (state, {shelf, products}: ProductsPoolForShelf) => state[shelf].push(...products),
  SET_BASKET: (state, recoveryBasket: ProductPoint[]) => state.clientBasket = recoveryBasket,
  SET_IS_BASKET_PRODUCTS: (state, status: boolean) => state.isBasketProductsInTheStore = status,
  SET_IS_BASKET_POINTS: (state, status: boolean) => state.isBasketPointsInTheStore = status,
  ADD_PRODUCT_TO_BASKET: (state, {shelf, _id}: ProductPoint) => state.clientBasket.push({shelf, _id}),
  DELETE_PRODUCT_AT_BASKET: (state, {shelf, _id}: ProductPoint) => {
    let deletedProductIndex = state.clientBasket.findIndex(itemId => itemId._id === _id)
    Vue.delete(state.clientBasket, deletedProductIndex)
  }
} as MutationTree<RootState>

const actions = {
  async FETCH_PRODUCTS({state, commit}, shelf: string): Promise<void> {  //грузим при посещении какой-либо полки Shop. Грузим сразу ВСЕ продукты.
    let basketShelfCounter = 1   //количество товаров, присутствующих в корзине на данной полке. Они могут быть уже загружены во Vuex (при посещении корзины) и поэтому не учитываться для оценки - "пустая ли" полка.
    for (let product of state.clientBasket) {
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
    
    console.log('FETCH_PRODUCT ===== ', shelf, _id)
    
    await axios.get(`/api/shop/${shelf}/${_id}`)
      .then(data => {
        commit('SET_PRODUCTS', {shelf, products: [data.data]})
        product = data.data
      })
    return product
  },
  async FETCH_BASKET_POINTS({state, commit}): Promise<void> {     //грузим при загрузе App
    await axios.get(`/api/basket`)
      .then(recoveryBasket => {
        if (recoveryBasket.data !== 'basket is empty')
          commit('SET_BASKET', recoveryBasket.data.basketPoints)
        commit('SET_IS_BASKET_POINTS', true)
      })
  },
  async FETCH_BASKET_PRODUCTS({state, getters, commit, dispatch}): Promise<void> {    //грузим при ПЕРВОМ посещении корзины. Восполняем товар, отсутствующий во Vuex.
    if (!state.isBasketPointsInTheStore)  //для состояния, когда, находясь на странице Корзина, мы перезагружаем броузер. Здесь требуется ждать обновления BasketPointsInTheStore.
      await dispatch('FETCH_BASKET_POINTS')
    
    if (state.clientBasket.length > 0) {
      //отбираем тот товар, который обозначен в корзине, но отсутствует во Vuex, (после перезагрузки сайта),
      //одновременно сортируя его по принадлежности к полкам и устраняя повторы.
      let unredundantedBasket = getters.GET_BASKET_POINTS.filter((item: ProductPoint, ind: number, arr: ProductPoint[]) => ind ==arr.findIndex(i => i._id === item._id))
      let upsetProducts = {} as any
      
      for (let productPoint of unredundantedBasket) {
        // @ts-ignore
        let isThere = state[productPoint.shelf].some(i => i._id === productPoint._id)  //присутствует ли корзиночный товар в shop'e.
        
        if (!isThere) {   //корзиночный товар - в shop'e отсутствует.
          if (!upsetProducts[productPoint.shelf])   //если поле для полки в upsetProducts отсутствует, то создаем его.
            upsetProducts[productPoint.shelf] = []
          upsetProducts[productPoint.shelf].push(productPoint)
        }
      }
      
      //дозагружаем недостающий товар
      for  (let shelf of Object.keys(upsetProducts)) {
        let shelfResponses =  upsetProducts[shelf].map((productPoint: ProductPoint) =>
          axios.get(`/api/shop/${productPoint.shelf}/${productPoint._id}`)
        )
        
        let responses = await Promise.allSettled(shelfResponses)
        
        //выбираем из каждого промиса только его .value.data
        let responseData = [] as Product[]
        //@ts-ignore
        for (let {value} of responses) {
          responseData.push(value.data)
        }
        commit('SET_PRODUCTS', {shelf, products: responseData})
      }
    }
    commit('SET_IS_BASKET_PRODUCTS', true)
  },
  async MOVE_THE_BASKET_PRODUCT({state, commit}, {shelf, _id, vector}: BasketMovement) {
    if (vector > 0) {
      await axios.put(`/api/basket`, {shelf, _id})
        .then(response => {
          if (response.status === 200)
            commit('ADD_PRODUCT_TO_BASKET', {shelf, _id})
        })
    } else {
      console.log('==== MOVE_THE_BASKET_PRODUCT')
      await axios.delete(`/api/basket`, {params: {productPoint: {shelf, _id}}})  //productPoint мы получаем как req.query.productPoint
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




