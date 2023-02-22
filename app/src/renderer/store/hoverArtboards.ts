import { defineStore } from 'pinia'

export const useHoverArtboardsStore = defineStore('hoverArtboards', {
  // A list of hover artboards by index
  // I.e. state.hoverArtboards = [ 0, 3 ]
  state: () => ({
    list: [],
  }),
  actions: {
    addHover(payload) {
      // Only add new numbers
      if (this.list.includes(payload)) return false

      // Add the payload
      this.list.push(payload)
    },
    removeHover(payload) {
      const index = this.list.findIndex((obj) => obj === payload)
      this.list.splice(index, 1)
    },

    emptyHover(payload) {
      this.list = []
    },
  },
})