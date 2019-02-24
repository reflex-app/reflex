import Vue from 'vue'

const state = [] // All artboards on the screen

const mutations = {
  /**
   * Add an Artboard
   * @param  {} state
   * @param  {} artboard
   */
  addArtboard(state, artboard) {
    let artboards = this.state.artboards
    let artboardsCounter = this.state.artboards.length || 0

    const uniqueID = () => {
      function check(val) {
        if (artboards.find(artboard => artboard.id === val)) {
          return false // not unique
        } else {
          return true // it's unique
        }
      }

      let increment = artboardsCounter // 0+

      // let flag = false
      // if (flag === false) {
      let val = increment++
      const flag = check(val) // True or False

      if (flag === true) {
        return val
      }
      // }
    }

    // Append a unique ID
    artboard.id = uniqueID()

    // Add to the array
    this.state.artboards.push(artboard)
  },

  /**
   * Remove an Artboard
   * @param  {} state
   * @param  {} id
   */
  removeArtboard(state, id) {
    let index = this.state.artboards.findIndex(obj => obj.id === id)
    Vue.delete(this.state.artboards, index)
  },

  /** Modify an Artboard by Index
   * @param  {} state
   * @param  {Object} artboard {id}
   */
  updateArtboardAtIndex(state, artboard) {
    // 1. Get the artboard.id
    let id = artboard.id
    let index = this.state.artboards.findIndex(obj => obj.id === id)

    // 2. Change just that artboard's content
    Vue.set(this.state.artboards, index, artboard)
  },

  /** Resize an Artboard
   * @param  {} state
   * @param  {Object} payload {id, height, width}
   */
  resizeArtboard(state, payload) {
    const artboards = this.state.artboards

    for (var i = 0; i < artboards.length; i++) {
      if (payload.id === artboards[i].id) { // look for match by id
        artboards[i].height = payload.height // updated object
        artboards[i].width = payload.width // updated object
        break // exit loop, object has been updated
      }
    }
  },

  setArtboardList(state, payload) {
    this.state.artboards = payload
  }
}

const actions = {
  addArtboard({commit}, artboard) {
    commit('addArtboard', artboard)
  },
  async addMultipleArtboards({commit}, payload) {
    const artboards = payload.data

    for (let i in artboards) {
      commit('addArtboard', artboards[i])
    }
  }
}

export default {
  state,
  mutations,
  actions
}
