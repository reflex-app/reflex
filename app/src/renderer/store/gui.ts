import { defineStore } from 'pinia'

const useGuiStore = defineStore('gui', {
  state = () => ({
    sidebar: true,
    focusMode: false,
    discoMode: false,
  }),
  getters: {},
  actions: {
    toggleSidebar(state, bool) {
      if (!bool) bool = ''

      if (bool === true) {
        state.sidebar = true
      } else if (bool === false) {
        state.sidebar = false
      } else {
        state.sidebar = !state.sidebar
      }
    },
    toggleGui(state, key) {
      state[key] = !state[key]
    },
  },
})
