import { App } from 'vue'
import Input from './input.vue'

Input.install = (Vue: App) => {
  Vue.component(Input.name, Input)
}

export default Input
