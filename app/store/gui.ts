import { defineStore } from 'pinia'

interface State {
  sidebar: boolean
  focusMode: boolean
  discoMode: boolean
  siteTree: boolean
  isScreensFullHeight: boolean
}

export const useGuiStore = defineStore('gui', {
  state: (): State => ({
    sidebar: true,
    focusMode: false,
    discoMode: false,
    siteTree: false,
    isScreensFullHeight: false,
  }),
  getters: {},
  actions: {
    toggleSidebar(bool?: boolean) {
      if (!bool) bool = ''

      if (bool === true) {
        this.sidebar = true
      } else if (bool === false) {
        this.sidebar = false
      } else {
        this.sidebar = !this.sidebar
      }
    },
    toggleGui(key: keyof State) {
      // Reverse the boolean value of the state key
      this[key] = !this[key]
    },
    setGui(key: keyof State, value: boolean) {
      this[key] = value
    },
  },
})
