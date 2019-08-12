const state = {
  isPanning: false,
  isZooming: false,
  isSelectingArea: false,
  isResizingArtboard: false
}

const getters = {
  /**
   * Getter to check if any states are true
   */
  isInteracting: state => {
    let isOn = false

    for (const s in state) {
      if (state[s] === true) {
        isOn = true
      }
    }

    return isOn
  }
}

const mutations = {
  interactionSetState: (state, {
    key,
    value
  }) => {
    state[key] = value
  }
}

export default {
  state,
  getters,
  mutations
}
