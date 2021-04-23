import ReflexUI from './core'
import * as components from './components'
import './index.scss'

const install = ReflexUI.install
ReflexUI.install = (Vue, options = {}) => {
  install.call(ReflexUI, Vue, { components, ...options })
}

// Automatic installation if Vue has been added to the global scope.
if (typeof window !== 'undefined' && window.Vue) window.Vue.use(ReflexUI)

export default ReflexUI
