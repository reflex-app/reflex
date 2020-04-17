// A list of hover artboards by index
// I.e. state.hoverArtboards = [ 0, 3 ]
export const state = () => []

export const mutations = {
  addHover: (state, payload) => {
    // Only add new numbers
    if (state.includes(payload)) return false

    // Add the payload
    state.push(payload)
  },

  removeHover: (state, payload) => {
    const index = state.findIndex((obj) => obj === payload)
    state.splice(index, 1)
  },

  emptyHover(state, payload) {
    // TODO Make this less specific
    this.state.hoverArtboards = []
  },
}

export const actions = {
  hoverArtboardsAdd({ commit }, payload) {
    commit('addHover', payload)
  },

  hoverArtboardsRemove({ commit }, payload) {
    commit('removeHover', payload)
  },

  hoverArtboardsEmpty({ commit }) {
    commit('emptyHover')
  },
}
