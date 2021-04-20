import { App } from 'vue'
import Icon from './icon.vue'

Icon.install = (Vue: App) => {
  Vue.component(Icon.name, Icon)
}

export default Icon
