import { createApp } from 'vue'
import App from './App.vue'
import DesignSystem from './index'
import './index.scss'

const app = createApp(App)
app.use(DesignSystem)
app.mount('#app')
