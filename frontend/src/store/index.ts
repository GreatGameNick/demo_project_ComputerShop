import Vue from 'vue'
import Vuex from 'vuex'
import {MutationTree, ActionTree, GetterTree} from 'vuex'
import {RootState, Product, ProductPoint} from '@/types';

import axios from "axios";

Vue.use(Vuex)

const state = () => ({
    laptops: [],
    mouses: [],
    accessories: [],
    clientBasket: []
}) as RootState

const getters = {
    // @ts-ignore
    GET_PRODUCTS: (state: RootState) => (shelf: string): Product [] => state[shelf],
    // @ts-ignore
    GET_PRODUCT: (state: RootState) => ({shelf, _id}: ProductPoint): Product | undefined => state[shelf].find(item => item._id === _id),
} as GetterTree<RootState, {}>

const mutations = {
    // @ts-ignore
    SET_PRODUCTS: (state, {shelf, products}) => state[shelf].push(...products),


    PUT_PRODUCT_TO_BASKET(state: RootState, id: number) {
        if (id > 0)   // добавляем
            state.clientBasket.push(id)
        if (id < 0) {  //удаляем 1 экземпляр из корзины
            let deletedProductIndex = state.clientBasket.findIndex(itemId => itemId === Math.abs(id))
            Vue.delete(state.clientBasket, deletedProductIndex)
        }
    },
} as MutationTree<RootState>

const actions = {
    async FETCH_PRODUCTS({state, commit}, shelf): Promise<void> {
        // @ts-ignore
        if (state[shelf].length < 2)
            await axios.get(`/api/shop/${shelf}`)
                .then(data => commit('SET_PRODUCTS', {shelf, products: data.data}))
    },
    async PRODUCT_REQUEST({state, commit, getters}, {shelf, _id}: ProductPoint): Promise<Product> {
        let product = getters.GET_PRODUCT({shelf, _id})

        if (!product)
            await axios.get(`/api/shop/${shelf}/${_id}`)
                .then(data => {
                    commit('SET_PRODUCTS', {shelf, products: [data.data]})
                    product = data.data
                })
        return product
    },
} as ActionTree<RootState, {}>

export default new Vuex.Store<RootState>({
    state,
    getters,
    mutations,
    actions,
    modules: {}
})




