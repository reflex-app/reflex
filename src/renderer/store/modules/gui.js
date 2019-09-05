const state = {
  sidebar: true,
  focusMode: false
}

const mutations = {
  /** Toggle the Sidebar on/off
   * @param  {} state
   * @param  {Boolean} bool
   */
  toggleSidebar(state, bool) {
    if (!bool) bool = ''

    if (bool === true) {
      state.sidebar = true
    } else if (bool === false) {
      state.sidebar = false
    } else {
      state.sidebar = !state.sidebar
    }
  },
  toggleFocusMode(state) {
    state.focusMode = !state.focusMode
  }
}

export default {
  state,
  mutations
}
