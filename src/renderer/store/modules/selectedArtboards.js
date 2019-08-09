const state = [] // A list of selected artboards by index
// I.e. state.selectedArtboards = [ 0, 3 ]

const mutations = {
  add: (state, payload) => {
    // Make sure it's a number
    payload = parseInt(payload, 10)

    // Only add new numbers
    if (state.includes(payload)) return false

    // Add the payload
    state.push(payload)
  },

  remove: (state, payload) => {
    const index = state.findIndex(obj => obj === payload)
    state.splice(index, 1)
  },

  empty(state, payload) {
    // TODO Make this less specific
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
  }) {
    commit('empty')
  }
}

export default {
  state,
  mutations,
  actions
}
