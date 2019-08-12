import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import sharedComponents from '@/components/shared' // These will be globally registered

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
