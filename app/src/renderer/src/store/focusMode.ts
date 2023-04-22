// TODO: This is almost exactly the same as the artboards module, consider making reusable
import { defineStore } from 'pinia'
import { v1 as uuid } from 'uuid'

export const useFocusMode = defineStore('focusMode', {
  state: () => ({
    activeScreen: {
      id: uuid(),
      title: 'Reflex',
      height: 300,
      width: 400,
    },
  }),
  getters: {},
  actions: {
    /** Resize an Artboard */
    focusResizeArtboard(payload) {
      this.activeScreen.height = payload.height
      this.activeScreen.width = payload.width
    },

    /** Set a random size for the active screen */
    focusSetRandomSize(options) {
      const artboard = this.activeScreen
      if (options.height) artboard.height = options.height
      if (options.width) artboard.width = options.width
    },

    /**
     * Change the activeScreen to a certain height, width
     * Expects an Artboard object
     */
    focusChangeActiveScreen(id) {
      const artboards = this.state.artboards.list // TODO: This is accessing another Vuex module; not obvious
      const index = artboards.findIndex((obj) => obj.id === id)
      this.activeScreen = Object.assign(this.activeScreen, artboards[index])
    },
  },
  persist: true,
})
