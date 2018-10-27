import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')

// Create a moveable canvas
import panzoom from "panzoom";
var canvas = document.querySelector('#canvas');
panzoom(canvas);
