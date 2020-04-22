export const state = () => ({
  sidebar: true,
  focusMode: false,
  discoMode: false,
  fullScreenWebPage: false,
})

export const mutations = {
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
  toggleGui(state, key) {
    if (state[key] === 'undefined')
      throw new Error(`No matching key: ${key} in state.gui`)
    state[key] = !state[key]
  },
  setFullscreen(state, key) {
    if (!key) throw new Error('No value provided')
    state[key] = key
  },
}
