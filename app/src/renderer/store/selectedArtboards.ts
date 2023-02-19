import { defineStore } from 'pinia'

const useSelectedArtboards = defineStore('selectedArtboards', {
  // A list of selected artboards by index
  // I.e. state.selectedArtboards = [ 0, 3 ]
  state: () => ({
    selectedArtboards: [],
  }),
  actions: {
    add: (payload) => {
      // Only add new numbers
      if (this.selectedArtboards.includes(payload)) return false

      // Add the payload
      this.selectedArtboards.push(payload)
    },
    remove: (payload) => {
      const index = this.selectedArtboards.findIndex((obj) => obj === payload)
      this.selectedArtboards.splice(index, 1)
    },
    empty(payload) {
      // TODO Make this less specific
      this.selectedArtboards = []
    },
  },
})
