import Vue from 'vue'
import Vuex from 'vuex'

// Load all Store modules
import modules from './modules'

Vue.use(Vuex)

// Create the Store
const store = new Vuex.Store({
  // namespaced: true,
  modules,
  strict: process.env.NODE_ENV !== 'production'
})

// Initialize localStorage
store.dispatch('initLocalStorage')

// Subscribe to store updates
store.subscribe((mutation, state) => {
  // Store the state object as a JSON string
  localStorage.setItem('store', JSON.stringify(state))
})

export default store
