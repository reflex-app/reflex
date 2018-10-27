import Vue from 'vue'
import store from './store/index'
import App from './App.vue'

// Vue Configuration
Vue.config.productionTip = false

// Create the <App> Vue instance
new Vue({
  el: "#app",
  store,
  render: h => h(App)
})

// Create a moveable canvas
import panzoom from "panzoom";
panzoom(document.querySelector('#canvas'));
