const state = {
  isPanning: false,
  isZooming: false,
  isSelectingArea: false
}

const mutations = {
  setState: (state, key, value) => {
    state[key] = value
  }
}

const actions = {
}

export default {
  state,
  mutations,
  actions
}
