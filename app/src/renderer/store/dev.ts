import { defineStore } from 'pinia'

export const useDevStore = defineStore('dev', {
  state: () => {
    showCanvasDebugger: false
  },
  actions: {
    toggleCanvasDebugger(state) {
      state.showCanvasDebugger = !state.showCanvasDebugger
    },
  },
})
