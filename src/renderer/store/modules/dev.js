const state = {
  showCanvasDebugger: true
}

const mutations = {
  /** Toggle the Sidebar on/off
   * @param  {} state
   * @param  {Boolean} bool
   */
  showCanvasDebugger(state) {
    state.showCanvasDebugger = !state.showCanvasDebugger
  }
}

export default {
  state,
  mutations
}
