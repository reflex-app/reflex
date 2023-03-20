import { Artboard } from './artboards'
import { defineStore } from 'pinia'

interface State {
  list: Artboard['id'][]
}

export const useSelectedArtboardsStore = defineStore('selectedArtboards', {
  // A list of selected artboards by index
  // I.e. state.selectedArtboards = [ 0, 3 ]
  state: (): State => ({
    list: [],
  }),
  actions: {
    /** Add a new Artboard to the list of selected artboards */
    add(id: Artboard['id']) {
      // Only add new numbers
      if (this.list.includes(id)) return false

      // Add the id
      this.list.push(id)
    },
    /** Remove a specific Artboard */
    remove(id: Artboard['id']) {
      const index = this.list.findIndex((i) => i === id)
      this.list.splice(index, 1)
    },
    /** Deletes all Artboards */
    empty() {
      // TODO Make this less specific
      this.list = []
    },
  },
})
