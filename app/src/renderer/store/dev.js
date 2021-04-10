export const state = () => ({
  showCanvasDebugger: false
})

export const mutations = {
  /** Toggle the Sidebar on/off
   * @param  {} state
   * @param  {Boolean} bool
   */
  toggleCanvasDebugger (state) {
    state.showCanvasDebugger = !state.showCanvasDebugger
  }
}
