import { App } from 'vue-demi'
import Button from './button.vue'

Button.install = (Vue: App) => {
  Vue.component(Button.name, Button)
}

export default Button
