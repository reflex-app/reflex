import { defineStore } from 'pinia'

export const useDevStore = defineStore('dev', {
  state: () => ({
    showCanvasDebugger: false,
  }),
  actions: {
    toggleCanvasDebugger() {
      this.showCanvasDebugger = !this.showCanvasDebugger
    },
  },
})
