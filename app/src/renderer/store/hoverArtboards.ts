import { defineStore } from 'pinia'

const useHoverArtboardsStore = defineStore('hoverArtboards', {
  // A list of hover artboards by index
  // I.e. state.hoverArtboards = [ 0, 3 ]
  state: () => ({
    hoverArtboards: [],
  }),
  actions: {
    addHover: (payload) => {
      // Only add new numbers
      if (this.hoverArtboards.includes(payload)) return false

      // Add the payload
      this.hoverArtboards.push(payload)
    },
    removeHover: (payload) => {
      const index = this.hoverArtboards.findIndex((obj) => obj === payload)
      this.hoverArtboards.splice(index, 1)
    },

    emptyHover(payload) {
      this.hoverArtboards = []
    },
  },
})
