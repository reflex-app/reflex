export const state = () => ({
  pages: [],
  currentPage: {
    index: 0,
    url: '',
    title: null,
    favicon: null
  }
})

export const mutations = {
  updateHistory: (state, payload) => {
    Object.assign(state.pages, payload)
  },
  addPage: (state, payload) => {
    state.pages.push(payload)
  },
  setCurrentPageIndex: (state, payload) => {
    switch (payload) {
      case 'forward':
        state.currentPage.index = state.currentPage.index + 1
        break

      case 'back':
        state.currentPage.index = state.currentPage.index - 1
        break

        // If adding a new page (i.e. user has entered a URL in the search input bar)
      case 'new':
        state.currentPage.index = state.pages.length - 1 // zero indexed
        break

        // Allow to set to a specific index
      default:
        state.currentPage.index = payload
        break
    }
  },
  /** Sets the Site Title (via iFrame)
   * @param  {} state
   * @param  {} val
   */
  changeSiteData: (state, val) => {
    if (!val) throw new Error('No value')

    // @TODO: Throttle this fn, as it will be called by
    // each <webview> when it loads, and doesn't need to keep changing

    if (val.title && val.title !== state.currentPage.title) {
      state.currentPage.title = val.title
    }

    if (val.url) {
      state.currentPage.url = val.url // Update the URL based on the incoming value
    }

    if (val.favicon) {
      state.currentPage.favicon = val.favicon // Update the URL based on the incoming value
    }
  }
}

export const actions = {
  reload() {},
  back({
    commit
  }) {
    commit('setCurrentPageIndex', 'back')
  },
  forward({
    commit
  }) {
    commit('setCurrentPageIndex', 'forward')
  },
  addPageToHistory({
    commit
  }, payload) {
    commit('addPage', payload) // Add to the array
    commit('setCurrentPageIndex', 'new') // Update the current page
  }
}