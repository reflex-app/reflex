import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

import modules from './modules'

Vue.use(Vuex)

// Persisted State
const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

export default new Vuex.Store({
  modules,
  plugins: [vuexLocal.plugin],
  strict: process.env.NODE_ENV !== 'production'
})
