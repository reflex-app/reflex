import { createApp } from 'vue'
import App from './App.vue'
import ReflexUI from './index'
import './index.scss'

const app = createApp(App)
app.use(ReflexUI)
app.mount('#app')
