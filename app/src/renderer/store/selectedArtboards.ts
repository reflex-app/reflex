import { Artboard } from './artboards'
import { defineStore } from 'pinia'

interface State {
  list: Artboard[]
}

export const useSelectedArtboardsStore = defineStore('selectedArtboards', {
  // A list of selected artboards by index
  // I.e. state.selectedArtboards = [ 0, 3 ]
  state: (): State => ({
    list: [],
  }),
  actions: {
    /** Add a new Artboard to the list of selected artboards */
    add(payload) {
      // Only add new numbers
      if (this.list.includes(payload)) return false

      // Add the payload
      this.list.push(payload)
    },
    /** Remove a specific Artboard */
    remove(payload) {
      const index = this.list.findIndex((obj) => obj === payload)
      this.list.splice(index, 1)
    },
    /** Deletes all Artboards */
    empty() {
      // TODO Make this less specific
      this.list = []
    },
  },
})
