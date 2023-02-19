import { defineStore } from 'pinia'
import { v1 as uuid } from 'uuid'

export const useArtboardsStore = defineStore('artboards', {
  state: () => ({
    list: [], // All artboards on the screen
  }),
  getters: {
    isArtboardInViewport: (state) => (id) => {
      const artboard = state.list.find((artboard) => artboard.id === id)
      if (!artboard) {
        console.error('Artboard not found')
        return
      }
      return artboard.isInViewport
    },
  },
  actions: {
    addArtboard(artboard) {
      this.list.push({
        title: artboard.title || 'Undefined',
        width: artboard.width || 375,
        height: artboard.height || 667,
        isVisible: artboard.isVisible || true,
        id: uuid(),
        isInViewport: artboard.isInViewport || false,
      })
    },
    removeArtboard(artboard) {
      const { id } = artboard
      const index = this.list.findIndex((obj) => obj.id === id)
      this.list.splice(index, 1)
    },
    addMultipleArtboards(payload) {
      const artboards = payload.data

      for (const i in artboards) {
        addArtboard(artboards[i])
      }
    },
    duplicateArtboard(payload) {
      const newId = uuid()

      if (newId === payload.id) throw new Error('Failed to generate new ID')

      const oldArtboard = payload

      // New object from payload
      const newArtboard = JSON.parse(JSON.stringify(payload))
      newArtboard.id = newId

      // Copy the input artboard
      // Insert a new one at the next index
      const index = this.list.findIndex((obj) => obj.id === oldArtboard.id)
      const newIndex = index + 1

      // Set a new ID
      newArtboard.id = uuid()

      // Push into array at index,
      // don't remove any, just insert this artboard
      this.list.splice(newIndex, 0, newArtboard)
    },
    changeArtboardViewportVisibility(artboard) {
      const { id, isVisible } = payload
      const artboard = state.list.find((obj) => obj.id === id)
      artboard.isInViewport = isVisible
    },
    changeArtboardVisibility(artboard) {
      // 1. Get the artboard.id
      const id = artboard.id
      const index = state.list.findIndex((obj) => obj.id === id)
      // 2. Change the visibility of just that artboard's is property
      state.list[index].isVisible = !artboard.isVisible
    },
    updateArtboardAtIndex(artboard) {
      // 1. Get the artboard.id
      const id = artboard.id
      const index = this.list.findIndex((obj) => obj.id === id)

      // 2. Change just that artboard's content
      this.list[index] = artboard
    },
    setArtboards(payload) {
      // TODO this is not reactive currently
      if (this.list !== payload) {
        this.list = payload
      }
    },
    resizeArtboard(artboard) {
      if (!artboard.id || !artboard.height || !artboard.width) {
        throw new Error('artboard missing properties')
      }

      const artboards = state.list

      for (let i = 0; i < artboards.length; i++) {
        if (artboard.id === artboards[i].id) {
          // look for match by id
          artboards[i].height = artboard.height // updated object
          artboards[i].width = artboard.width // updated object
          break // exit loop, object has been updated
        }
      }
    },
  },
})
