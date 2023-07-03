import { defineStore } from 'pinia'

interface State {
  internal: {
    isPanzooming: boolean
    isResizingArtboard: boolean
    isSelectingArea: boolean
  }
  isInteracting: boolean
  isWebInteractionContext: boolean
  panzoomEnabled: boolean
}

export const useInteractionStore = defineStore('interactions', () => {
  const state = reactive<State>({
    internal: {
      isPanzooming: false,
      isSelectingArea: false,
      isResizingArtboard: false,
    },
    isInteracting: false,
    isWebInteractionContext: false,
    panzoomEnabled: true,
  })

  const getters = {
    // TODO this should also take into consideration if 1+ screens are selected,
    // or if there is a panzoom event happening
    currentContext: computed(() =>
      state.isWebInteractionContext ? 'web' : 'app'
    ),
  }

  const actions = {
    interactionSetState({
      key,
      value,
    }: {
      key: keyof State['internal']
      value: boolean
    }): void {
      if (state.internal[key] !== value) {
        state.internal[key] = value
      }
    },
    setPanzoomState(value: boolean): void {
      state.panzoomEnabled = value
    },
    setWebInteractionState(value: boolean): void {
      state.isWebInteractionContext = value
    },
  }

  // Dynamically set isInteracting if 1+ internal properties are true
  watch(state.internal, () => {
    // Check if any of the internal properties are set to true
    // If so, we say the user is interacting
    let isOn = false

    for (const s in state.internal) {
      if (state.internal[s as keyof (typeof state)['internal']] === true) {
        isOn = true
      }
    }

    state.isInteracting = isOn
  })

  return { ...toRefs(state), ...getters, ...actions, persist: true }
})
