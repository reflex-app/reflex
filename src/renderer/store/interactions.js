export const state = () => ({
  // isPanning: false,
  // isZooming: false,
  internal: {
    isPanzooming: false,
    isSelectingArea: false,
    isResizingArtboard: false,
  },
  panzoomEnabled: true,
})

export const getters = {
  /**
   * Getter to check if any states are true
   * Is Interacting = true when any internal state is true
   */
  isInteracting: (state) => {
    let isOn = false

    for (const s in state.internal) {
      if (state[s] === true) {
        console.log(state[s])

        isOn = true
      }
    }

    return isOn
  },
}

export const mutations = {
  interactionSetState: (state, { key, value }) => {
    if (state[key] !== value) {
      state[key] = value
    }
  },
  setPanzoomState: (state, { value }) => {
    state.panzoomEnabled = value
  },
}
