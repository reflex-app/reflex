export const state = () => ({
  sidebar: true
})

export const mutations = {
  /** Toggle the Sidebar on/off
   * @param  {} state
   * @param  {Boolean} bool
   */
  toggleSidebar(state, bool) {
    if (!bool) bool = ''

    if (bool === true) {
      this.state.gui.sidebar = true
    } else if (bool === false) {
      this.state.gui.sidebar = false
    } else {
      this.state.gui.sidebar = !this.state.gui.sidebar
    }
  }
}
