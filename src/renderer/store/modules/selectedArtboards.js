import Vue from 'vue'
const state = [] // A list of selected artboards by index
// I.e. state.selectedArtboards = [ 0, 3 ]

const mutations = {
  add(state, payload) {
    // Only add new numbers
    if (state.includes(payload)) return false

    // Add the payload
    this.state.selectedArtboards.push(payload)
  },

  remove(state, payload) {
    let index = this.state.selectedArtboards.findIndex(obj => obj === payload)
    Vue.delete(this.state.selectedArtboards, index)
  },

  empty(state) {
    this.state.selectedArtboards = []
  }
}

const actions = {
  selectedArtboardsAdd({
    commit
  }, payload) {
    commit('add', payload)
  },

  selectedArtboardsRemove({
    commit
  }, payload) {
    commit('remove', payload)
  },

  selectedArtboardsEmpty({
    commit
  }, payload) {
    commit('empty')
  }
}

export default {
  state,
  mutations,
  actions
}
