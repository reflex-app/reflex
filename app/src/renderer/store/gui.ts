import { defineStore } from 'pinia'

interface State {
  sidebar: boolean
  focusMode: boolean
  discoMode: boolean
}

export const useGuiStore = defineStore('gui', {
  state: (): State => ({
    sidebar: true,
    focusMode: false,
    discoMode: false,
  }),
  getters: {},
  actions: {
    toggleSidebar(bool?) {
      if (!bool) bool = ''

      if (bool === true) {
        this.sidebar = true
      } else if (bool === false) {
        this.sidebar = false
      } else {
        this.sidebar = !this.sidebar
      }
    },
    toggleGui(state, key) {
      state[key] = !state[key]
    },
  },
})
