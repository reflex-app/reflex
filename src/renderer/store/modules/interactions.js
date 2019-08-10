const state = {
  isPanning: false,
  isZooming: false,
  isSelectingArea: false
}

const mutations = {
  interactionSetState: (state, { key, value }) => {
    state[key] = value
  }
}

export default {
  state,
  mutations
}
