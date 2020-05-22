import Vue from 'vue'
import Vuex from '@/utils/vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userinfo: {
      name: 'ly',
      age: 18
    }
  },
  getters: {
    myAge (state) {
      return state.userinfo.age + 10
    }
  },
  mutations: {
    syncAdd (state, payload) {
      state.userinfo.age += payload
    },
    syncMinus (state, payload) {
      state.userinfo.age -= payload
    }
  },
  actions: {
    asyncMinus ({ commit }, payload) {
      setTimeout(() => {
        commit('syncMinus', payload)
      }, 1000)
    }
  }
})
