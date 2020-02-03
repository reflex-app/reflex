const uuid = require('uuid/v1')

// All artboards on the screen
// const state = []
const state = () => {
  return []
}

/**
 * Mock:
 * state = [
 *    { id: ~uuid~,
 *      title: 'Mobile',
 *      height: 300,
 *      width: 400,
 *      x: 0,
 *      y: 0
 *    }
 * ]
 */

const mutations = {
  /**
   * Add an Artboard
   * @param  {} state
   * @param  {} artboard
   */
  addArtboard(state, artboard) {
    artboard.id = uuid()
    state.push(artboard)
  },

  /**
   * Add an Artboard
   * @param  {} state
   * @param  {} artboard
   */
  duplicateArtboard(state, payload) {
    const {
      oldArtboard,
      newArtboard
    } = payload

    // Copy the input artboard
    // Insert a new one at the next index
    const index = state.findIndex(obj => obj.id === oldArtboard.id)
    const newIndex = index + 1

    // Push into array at index,
    // don't remove any, just insert this artboard
    state.splice(newIndex, 0, newArtboard)
  },

  /**
   * Remove an Artboard
   * @param  {} state
   * @param  {} id
   */
  removeArtboard(state, id) {
    const index = state.findIndex(obj => obj.id === id)
    state.splice(index, 1)
  },

  /**
   * Change artboard visibility
   * @param  {} state
   * @param  {Object} artboard {id}
   */
  changeArtboardVisibility(state, artboard) {
    // 1. Get the artboard.id
    const id = artboard.id
    const index = state.findIndex(obj => obj.id === id)
    // 2. Change the visibility of just that artboard's is property
    state[index].isVisible = !artboard.isVisible
  },

  /** Modify an Artboard by Index
   * @param  {} state
   * @param  {Object} artboard {id}
   */
  updateArtboardAtIndex(state, artboard) {
    // 1. Get the artboard.id
    const id = artboard.id
    const index = state.findIndex(obj => obj.id === id)

    // 2. Change just that artboard's content
    state[index] = artboard
  },

  /** Resize an Artboard
   * @param  {} state
   * @param  {Object} payload {id, height, width}
   */
  resizeArtboard(state, payload) {
    const artboards = state

    for (var i = 0; i < artboards.length; i++) {
      if (payload.id === artboards[i].id) { // look for match by id
        artboards[i].height = payload.height // updated object
        artboards[i].width = payload.width // updated object
        break // exit loop, object has been updated
      }
    }
  },

  setArtboardList: (state, payload) => {
    // TODO this is not reactive currently
    if (state !== payload) {
      state = payload
    }
  }
}

const actions = {
  addArtboard({
    commit
  }, artboard) {
    commit('addArtboard', artboard)
  },
  async addMultipleArtboards({
    commit
  }, payload) {
    const artboards = payload.data

    for (const i in artboards) {
      commit('addArtboard', artboards[i])
    }
  },
  async duplicateArtboard({
    commit
  }, payload) {
    const newId = uuid()

    if (newId === payload.id) throw new Error('Failed to generate new ID')

    // New object from payload
    const newArtboard = JSON.parse(JSON.stringify(payload))
    newArtboard.id = newId

    commit('duplicateArtboard', {
      oldArtboard: payload,
      newArtboard: newArtboard
    })
  }
}

export default {
  state,
  mutations,
  actions
}
