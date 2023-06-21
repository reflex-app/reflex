import { defineStore } from 'pinia'
import { v1 as uuid } from 'uuid'

export interface Artboard {
  height: number
  viewportHeight: number
  fullHeight: number
  width: number
  title: string
  id: string
  isVisible: boolean
  isInViewport: boolean
}

interface State {
  list: Artboard[]
}

export const useArtboardsStore = defineStore('artboards', {
  state: (): State => ({
    list: [], // All artboards on the screen
  }),
  getters: {
    isArtboardInViewport: (state) => (id: Artboard['id']) => {
      const artboard = state.list.find((artboard) => artboard.id === id)
      if (!artboard) {
        console.error('Artboard not found')
        return
      }
      return artboard.isInViewport
    },
  },
  actions: {
    addArtboard(artboard: Artboard) {
      this.list.push({
        title: artboard.title || 'Undefined',
        width: artboard.width || 375,
        height: artboard.height || 667,
        fullHeight: artboard.fullHeight || 0,
        viewportHeight: artboard.viewportHeight || artboard.height || 0,
        isVisible: artboard.isVisible || true,
        id: uuid(),
        isInViewport: artboard.isInViewport || false,
      })
    },
    removeArtboard(id: Artboard['id']) {
      const index = this.list.findIndex((obj) => obj.id === id)
      this.list.splice(index, 1)
    },
    addMultipleArtboards(payload: { data: Artboard[] }) {
      const artboards = payload.data

      for (const i in artboards) {
        this.addArtboard(artboards[i])
      }
    },
    duplicateArtboard(payload: Artboard) {
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
    changeArtboardViewportVisibility(payload: {
      id: string
      isVisible: boolean
    }) {
      const { id, isVisible } = payload
      const artboard = this.list.find((obj) => obj.id === id)
      artboard
        ? (artboard.isInViewport = isVisible)
        : console.warn('No artboard found')
    },
    changeArtboardVisibility(id: Artboard['id']) {
      const match = this.list.find((obj) => obj.id === id)

      if (!match) {
        console.error('Artboard not found')
        return
      }

      match.isVisible = !match.isVisible
    },
    updateArtboardAtIndex(artboard: Partial<Artboard>) {
      // 1. Get the artboard.id
      if (!artboard.id) {
        console.error('artboard missing properties')
        return
      }
      const { id } = artboard
      const currentArtboard = this.list.find((obj) => obj.id === id)
      const index = this.list.findIndex((obj) => obj.id === id)

      if (!currentArtboard) {
        console.error('Artboard not found')
        return
      }

      // 2. Change just that artboard's content
      // IMPORTANT: Vue.set() is required to keep reactivity!
      // https://github.com/vuejs/pinia/issues/452#issuecomment-827059072
      // Vue.set(this.list, index, artboard)

      // Vue 3 should not need to use Vue.set() anymore
      // TODO: Verify this works
      this.list[index] = { ...currentArtboard, ...artboard }
    },
    setArtboards(payload: Artboard[]) {
      if (this.list !== payload) {
        this.list = payload
      }
    },
    resizeArtboard(artboard: Partial<Artboard>) {
      if (!artboard.id) {
        throw new Error('artboard missing properties')
      }

      const index = this.list.findIndex((a) => a.id === artboard.id)

      if (index === -1) {
        console.error('Artboard not found')
        return
      }

      console.log(
        'artboard',
        this.list[index].viewportHeight,
        artboard.viewportHeight
      )

      const updatedArtboard = {
        ...this.list[index],
        ...artboard,
      }

      this.list.splice(index, 1, updatedArtboard)
    },
    setArtboardToFullHeight({ id }: { id: Artboard['id'] }) {
      const artboard = this.list.find((artboard) => artboard.id === id)
      if (!artboard) {
        console.error('Artboard not found')
        return
      }

      artboard.height = artboard.fullHeight
    },
    setArtboardToViewportHeight({ id }: { id: Artboard['id'] }) {
      const artboard = this.list.find((artboard) => artboard.id === id)
      if (!artboard) {
        console.error('Artboard not found')
        return
      }

      artboard.height = artboard.viewportHeight
    },
  },
  persist: true,
})
