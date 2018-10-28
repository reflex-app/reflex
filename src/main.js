import Vue from 'vue'
import App from './App.vue'
import store from './store/index'
import panzoom from "panzoom"

// Vue Configuration
Vue.config.productionTip = false

// Panzoom
Vue.prototype.$panzoom = panzoom;

// Create the <App> Vue instance
new Vue({
  el: "#app",
  store,
  render: h => h(App)
})