import Vue from 'vue'

// All artboards on the screen
const state = []

const mutations = {
  /**
   * Add an Artboard
   * @param  {} state
   * @param  {} artboard
   */
  addArtboard(state, artboard) {
    const artboards = state
    const artboardsCounter = state.length || 0

    const uniqueID = () => {
      function check(val) {
        if (artboards.find(artboard => artboard.id === val)) {
          return false // not unique
        } else {
          return true // it's unique
        }
      }

      let increment = artboardsCounter // 0+

      const val = increment++
      const flag = check(val) // True or False

      if (flag === true) {
        return val
      }
    }

    // Append a unique ID
    artboard.id = uniqueID()

    // Add to the array
    state.push(artboard)
  },

  /**
   * Remove an Artboard
   * @param  {} state
   * @param  {} id
   */
  removeArtboard(state, id) {
    const index = state.findIndex(obj => obj.id === id)
    Vue.delete(state, index)
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
