import { v1 as uuid } from 'uuid'

// All artboards on the screen
export const state = () => ({
  list: [],
})

export const mutations = {
  /**
   * Add an Artboard
   * @param  {} state
   * @param  {} artboard
   */
  addArtboard(state, artboard) {
    state.list.push({
      title: artboard.title || 'Undefined',
      width: artboard.width || 375,
      height: artboard.height || 667,
      isVisible: artboard.isVisible || true,
      id: uuid(),
      isInViewport: artboard.isInViewport || false,
    })
  },

  /**
   * Add an Artboard
   * @param  {} state
   * @param  {} artboard
   */
  duplicateArtboard(state, payload) {
    const { oldArtboard, newArtboard } = payload

    // Copy the input artboard
    // Insert a new one at the next index
    const index = state.list.findIndex((obj) => obj.id === oldArtboard.id)
    const newIndex = index + 1

    // Set a new ID
    newArtboard.id = uuid()

    // Push into array at index,
    // don't remove any, just insert this artboard
    state.list.splice(newIndex, 0, newArtboard)
  },

  /**
   * Change the viewport visibility
   * @param {*} state
   * @param {*} payload
   */
  changeArtboardViewportVisibility(state, payload) {
    const { id, isVisible } = payload
    const artboard = state.list.find((obj) => obj.id === id)
    artboard.isInViewport = isVisible
  },

  /**
   * Change artboard visibility
   * @param  {} state
   * @param  {Object} artboard {id}
   */
  changeArtboardVisibility(state, artboard) {
    // 1. Get the artboard.id
    const id = artboard.id
    const index = state.list.findIndex((obj) => obj.id === id)
    // 2. Change the visibility of just that artboard's is property
    state.list[index].isVisible = !artboard.isVisible
  },

  /**
   * Remove an Artboard
   * @param  {} state
   * @param  {} id The ID of the artboard object
   */
  removeArtboard(state, id) {
    const index = state.list.findIndex((obj) => obj.id === id)
    state.list.splice(index, 1)
  },

  /** Modify an Artboard by Index
   * @param  {} state
   * @param  {Object} artboard {id}
   */
  updateArtboardAtIndex(state, artboard) {
    // 1. Get the artboard.id
    const id = artboard.id
    const index = state.list.findIndex((obj) => obj.id === id)

    // 2. Change just that artboard's content
    state.list[index] = artboard
  },

  /** Resize an Artboard
   * @param  {} state
   * @param  {Object} payload Requires id, height, width
   */
  resizeArtboard(state, payload) {
    if (!payload.id || !payload.height || !payload.width) {
      throw new Error('Payload missing properties')
    }

    const artboards = state.list

    for (let i = 0; i < artboards.length; i++) {
      if (payload.id === artboards[i].id) {
        // look for match by id
        artboards[i].height = payload.height // updated object
        artboards[i].width = payload.width // updated object
        break // exit loop, object has been updated
      }
    }
  },

  set(state, payload) {
    // TODO this is not reactive currently
    if (state !== payload) {
      state.list = payload
    }
  },
}

export const actions = {
  addArtboard({ commit }, artboard) {
    commit('addArtboard', artboard)
  },
  deleteArtboard({ commit }, artboard) {
    if (
      confirm(
        `Are you sure you want to delete the ${artboard.title} screen size? Click "OK" to delete.`
      )
    ) {
      commit('removeArtboard', artboard.id)
    }
  },
  addMultipleArtboards({ commit }, payload) {
    const artboards = payload.data

    for (const i in artboards) {
      commit('addArtboard', artboards[i])
    }
  },
  duplicateArtboard({ commit }, payload) {
    const newId = uuid()

    if (newId === payload.id) throw new Error('Failed to generate new ID')

    // New object from payload
    const newArtboard = JSON.parse(JSON.stringify(payload))
    newArtboard.id = newId

    commit('duplicateArtboard', {
      oldArtboard: payload,
      newArtboard,
    })
  },
  setArtboards({ commit }, payload) {
    commit('set', payload)
  },
  resizeArtboard({ commit }, payload) {
    commit('resizeArtboard', payload)
  },
  changeArtboardViewportVisibility({ commit }, artboard) {
    commit('changeArtboardViewportVisibility', artboard)
  },
}
