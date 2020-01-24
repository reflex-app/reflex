export const state = () => ({
  isPanning: false,
  isZooming: false,
  isSelectingArea: false,
  isResizingArtboard: false
})

export const getters = {
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

export const mutations = {
  interactionSetState: (state, {
    key,
    value
  }) => {
    if (state[key] !== value) {
      state[key] = value
    }
  }
}