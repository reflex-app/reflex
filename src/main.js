import Vue from 'vue'
import store from './store/index'
import App from './App.vue'
import panzoom from "panzoom"

// Vue Configuration
Vue.config.productionTip = false

// Create the <App> Vue instance
new Vue({
  el: "#app",
  store,
  render: h => h(App)
})

// Create a moveable canvas
export const panzoomInstance = panzoom(document.querySelector('#canvas'));
