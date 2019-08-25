import Vue from 'vue'
const uuid = require('uuid/v1')

// All artboards on the screen
const state = []

/**
 * Mock:
 * state = [
 *    { id: 0, title: 'Mobile', height: 300, width: 400 }
 *    { id: 0, title: 'Desktop', height: 900, width: 1440 }
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
   * Remove an Artboard
   * @param  {} state
   * @param  {} id
   */
  removeArtboard(state, id) {
    const index = state.findIndex(obj => obj.id === id)
    state.splice(index, 1)
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
    Vue.set(state, index, artboard)
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

  setArtboardList(state, payload) {
    state = payload
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
  }
}

export default {
  state,
  mutations,
  actions
}
