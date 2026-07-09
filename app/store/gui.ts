import { defineStore } from 'pinia'

interface State {
  sidebar: boolean
  focusMode: boolean
  discoMode: boolean
  siteTree: boolean
  isScreensFullHeight: boolean
  isFullscreenArtboard: boolean
}

export const useGuiStore = defineStore('gui', {
  state: (): State => ({
    sidebar: true,
    focusMode: false,
    discoMode: false,
    siteTree: false,
    isScreensFullHeight: false,
    isFullscreenArtboard: false,
  }),
  getters: {},
  actions: {
    toggleSidebar(bool?: boolean) {
      this.sidebar = bool ?? !this.sidebar
    },
    toggleGui(key: keyof State) {
      // Reverse the boolean value of the state key
      this[key] = !this[key]
    },
    setGui(key: keyof State, value: boolean) {
      this[key] = value
    },

  },
  // Save this store in localStorage
  persist: true,
})
