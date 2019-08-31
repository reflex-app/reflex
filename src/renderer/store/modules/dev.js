const state = {
  showCanvasDebugger: false
}

const mutations = {
  /** Toggle the Sidebar on/off
   * @param  {} state
   * @param  {Boolean} bool
   */
  toggleCanvasDebugger(state) {
    state.showCanvasDebugger = !state.showCanvasDebugger
    console.log('called')
  }
}

export default {
  state,
  mutations
}
