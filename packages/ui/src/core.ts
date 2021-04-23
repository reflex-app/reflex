export default class ReflexUI {
  static instance = null
  static vueInstance = null // Needed until constructor.

  static install(Vue, options = {}) {
    // Register directives.
    // for (const id in directives) {
    //   if (directives[id]) Vue.directive(id, directives[id])
    // }
    Vue.directive('focus', {
      // When the bound element is inserted into the DOM...
      inserted: (el) => el.focus(),
    })

    // Register components
    const { components = {} } = options || {}
    for (let id in components) {
      const component = components[id]
      Vue.component(component.name, component)
    }

    // Register mixins.
    // Vue.mixin({
    //   mounted () {
    //   }
    // })

    // Save the Vue instance for use in the constructor.
    ReflexUI.vueInstance = Vue
  }

  // Singleton
  constructor(options = {}) {
    if (ReflexUI.instance) return ReflexUI.instance
    else {
      // Merge user options into default config.
      // mergeConfig(options)

      ReflexUI.instance = this

      // Make ReflexUI reactive and expose the single instance in Vue.
      // ReflexUI.vueInstance.prototype.$reflexui = ReflexUI.vueInstance.observable(
      //   this
      // )

      // delete ReflexUI.vueInstance // Get rid of the Vue instance that we don't need anymore.
    }
  }
}

ReflexUI.version = '__VERSION__'
