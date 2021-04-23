import { install } from 'vue'
install()
// Make sure composition API is installed for Vue2 users
// https://github.com/vueuse/vue-demi#install

import { createApp } from 'vue'
import App from './App.vue'
import DesignSystem from './index'

const app = createApp(App)
app.use(DesignSystem)
app.mount('#app')
