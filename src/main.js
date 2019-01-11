import Vue from 'vue'
import App from './App.vue'
import store from './store'

// Vue Configuration
Vue.config.productionTip = false

// Create the <App> Vue instance
new Vue({
  el: "#app",
  store, // Vuex Store
  render: h => h(App)
})