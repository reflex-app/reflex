import { defineStore } from 'pinia'

interface State {
  internal: {
    isPanzooming: boolean
    isResizingArtboard: boolean
  }
  isWebInteractionContext: boolean
  panzoomEnabled: boolean
}

export const useInteractionStore = defineStore('interactions', {
  state: (): State => ({
    // isPanning: false,
    // isZooming: false,
    internal: {
      isPanzooming: false,
      // isSelectingArea: false,
      isResizingArtboard: false,
    },
    isWebInteractionContext: false,
    panzoomEnabled: true,
  }),
  getters: {
    isInteracting: (state) => {
      /**
       * Getter to check if any states are true
       * Is Interacting = true when any internal state is true
       */
      let isOn = false

      for (const s in state.internal) {
        if (state[s] === true) {
          isOn = true
        }
      }

      return isOn
    },

    /**
     * Is the current user in the
     * app context or the web interaction context?
     */
    currentContext: (state) => {
      // TODO this should also take into consideration if 1+ screens are selected,
      // or if there is a panzoom event happening
      return state.isWebInteractionContext ? 'web' : 'app'
    },
  },
  actions: {
    interactionSetState({ key, value }) {
      if (this.internal[key] !== value) {
        this.internal[key] = value
      }
    },
    setPanzoomState({ value }) {
      this.panzoomEnabled = value
    },
    setWebInteractionState(value) {
      this.isWebInteractionContext = value
    },
  },
})
