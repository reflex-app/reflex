import Vue from 'vue'
import App from './App.vue'
import store from './store/index'

// Vue Configuration
Vue.config.productionTip = false

// Create the <App> Vue instance
new Vue({
  el: "#app",
  store,
  render: h => h(App)
})