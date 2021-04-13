import { install } from 'vue-demi'
install()
// Make sure composition API is installed for Vue2 users
// https://github.com/vueuse/vue-demi#install

import { createApp } from 'vue-demi'
import App from './App.vue'
import DesignSystem from './index'

const app = createApp(App)
app.use(DesignSystem)
app.mount('#app')
