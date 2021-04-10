// Import components
import Button from '@/components/button'

// Import any CSS styles
// import './styles/index.scss'
import { App } from 'vue'

// Declare components
const components = {
  Button,
}

// Export the default install function
// which loops through each Vue component and makes it available
export default function install(Vue: App) {
  // tslint:disable-next-line: forin
  for (const component in components) {
    // @ts-expect-error
    Vue.component(components[component].name, components[component])
  }
}

// Export each component as a module
export { default as Button } from '@/components/button'
