const state = {
  pages: [],
  currentPage: 0
}

const mutations = {
  updateHistory: (state, payload) => {
    Object.assign(state.pages, payload)
  },
  addPage: (state, payload) => {
    state.pages.push(payload)
  },
  setCurrentPage: (state, payload) => {
    switch (payload) {
      case "forward":
        state.currentPage = state.currentPage + 1
        break;

      case "back":
        state.currentPage = state.currentPage - 1
        break;

        // If adding a new page (i.e. user has entered a URL in the search input bar)
      case "new":
        state.currentPage = state.pages.length - 1 // zero indexed
        break;

        // Allow to set to a specific index
      default:
        state.currentPage = payload
        break;
    }
  }
}

const actions = {
  reload() {},
  back({
    commit
  }) {
    commit('setCurrentPage', 'back')
  },
  forward({
    commit
  }) {
    commit('setCurrentPage', 'forward')
  },
  addPageToHistory({
    commit
  }, payload) {
    commit('addPage', payload) // Add to the array
    commit('setCurrentPage', 'new') // Update the current page
  }
}

export default {
  state,
  mutations,
  actions
}