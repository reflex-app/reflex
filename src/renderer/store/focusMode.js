// TODO This is almost exactly the same as the artboards module, consider making reusable
import { v1 as uuid } from 'uuid'

// All artboards on the screen
// const state = []
export const state = () => ({
  activeScreen: {
    id: uuid(),
    title: 'Reflex',
    height: 300,
    width: 400,
  },
  // screens: [{
  //   id: uuid(),
  //   title: 'Test',
  //   height: 300,
  //   width: 400
  // }, {
  //   id: uuid(),
  //   title: 'Test',
  //   width: 1280,
  //   height: 720
  // }, {
  //   id: uuid(),
  //   title: 'Test',
  //   width: 1920,
  //   height: 1080
  // }
})

export const mutations = {
  /** Resize an Artboard
   * @param  {} state
   * @param  {Object} payload {id, height, width}
   */
  focusResizeArtboard(state, payload) {
    state.activeScreen.height = payload.height
    state.activeScreen.width = payload.width
  },

  /**
   * Set a random size for the active screen
   * (Disco Mode)
   * @param {*} state
   * @param {*} options
   */
  focusSetRandomSize(state, options) {
    const artboard = state.activeScreen
    if (options.height) artboard.height = options.height
    if (options.width) artboard.width = options.width
  },

  /**
   * Change the activeScreen to a certain height, width
   * Expects an Artboard object
   * @param {*} state
   * @param {*} id
   */
  focusChangeActiveScreen(state, id) {
    const artboards = this.state.artboards.list // TODO This is accessing another Vuex module; not obvious
    const index = artboards.findIndex((obj) => obj.id === id)
    state.activeScreen = Object.assign(state.activeScreen, artboards[index])
  },
}
