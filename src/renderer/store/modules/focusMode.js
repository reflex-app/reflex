// TODO This is almost exactly the same as the artboards module,
// consider making reusable
const uuid = require('uuid/v1')

// All artboards on the screen
// const state = []
const state = {
  activeScreen: {
    id: uuid(),
    title: 'Test',
    height: 300,
    width: 400
    /**
     * id: ~uuid~,
     * title: 'Mobile',
     * height: 300,
     * width: 400
     */
  },
  screens: [{
    id: uuid(),
    title: 'Test',
    height: 300,
    width: 400
  }, {
    id: uuid(),
    title: 'Test',
    width: 1280,
    height: 720
  }, {
    id: uuid(),
    title: 'Test',
    width: 1920,
    height: 1080
  }
    /**
     *    { id: ~uuid~,
     *      title: 'Mobile',
     *      height: 300,
     *      width: 400,
     *    }
     */
  ]
}

const mutations = {
  /**
   * Add an Artboard
   * @param  {} state
   * @param  {} artboard
   */
  addArtboard(state, artboard) {
    artboard.id = uuid()
    state.screens.push(artboard)
  },

  /**
   * Remove an Artboard
   * @param  {} state
   * @param  {} id
   */
  removeArtboard(state, id) {
    const index = state.screens.findIndex(obj => obj.id === id)
    state.screens.splice(index, 1)
  },

  /** Modify an Artboard by Index
   * @param  {} state
   * @param  {Object} artboard {id}
   */
  updateArtboardAtIndex(state, artboard) {
    // 1. Get the artboard.id
    const id = artboard.id
    const index = state.screens.findIndex(obj => obj.id === id)

    // 2. Change just that artboard's content
    state.screens[index] = artboard
  },

  /** Resize an Artboard
   * @param  {} state
   * @param  {Object} payload {id, height, width}
   */
  focusResizeArtboard(state, payload) {
    const artboards = state.screens
    const resizable = artboards.find(artboard => artboard.id === payload.id)

    // Update both the activeScreen and the specified screen
    resizable.height = payload.height
    resizable.width = payload.width

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
   * Change the activeScreen
   * @param {*} state
   * @param {*} id
   */
  focusChangeActiveScreen(state, id) {
    const index = state.screens.findIndex(obj => obj.id === id)
    state.activeScreen = Object.assign(state.activeScreen, state.screens[index])
  },

  setArtboardList: (state, payload) => {
    // TODO this is not reactive currently
    if (state.screens !== payload) {
      state.screens = payload
    }
  }
}

const actions = {
  addArtboard({
    commit
  }, artboard) {
    commit('addArtboard', artboard)
  }
}

export default {
  state,
  mutations,
  actions
}
