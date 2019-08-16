import Vue from 'vue'
import Vuex from 'vuex'

// Load all Store modules
import modules from './modules'

Vue.use(Vuex)

// Create the Store
const store = new Vuex.Store({
  modules,
  strict: process.env.NODE_ENV !== 'production'
})

export default store
