import Vue from 'vue'
import Vuex from 'vuex'
import {MutationTree, ActionTree, GetterTree} from 'vuex'
import {RootState, Product} from '@/types';

import axios from "axios";

Vue.use(Vuex)

const state = () => ({
    laptops: [],
    mouses: [],
    accessories: [],
    clientBasket: []
}) as RootState

const getters = {
    GET_PRODUCTS: (state: RootState) => (shelf: string): Product [] => {
        let clearShelfName = shelf.replace("/", "")
        // @ts-ignore
        return state[clearShelfName]
    },


    GET_PRODUCT: (state: RootState) => (id: number): Product => {
        let productIndex = state.laptops.findIndex(item => item._id === id)
        return state.laptops[productIndex]
    },
} as GetterTree<RootState, {}>

const mutations = {
    // @ts-ignore
    SET_PRODUCTS: (state, {shelf, products}) => state[shelf] = products,


    CHANGE_NAME: (state, newDescription: string) => state.laptops[0].description = newDescription,
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
    FETCH_PRODUCTS({state, commit}, shelf): void {
        let clearShelfName = shelf.replace("/", "")

        // @ts-ignore
        if (state[clearShelfName].length === 0)
            axios.get(`/api/shop/${clearShelfName}`)
                .then(data => commit('SET_PRODUCTS', {shelf: clearShelfName, products: data.data}))
    },
    add({commit, state}, text: string): void {
        commit('add', text)
    }
} as ActionTree<RootState, {}>

export default new Vuex.Store<RootState>({
    state,
    getters,
    mutations,
    actions,
    modules: {}
})




