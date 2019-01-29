const state = {
  url: '', // The current URL being viewed
  title: '', // The title of the page being viewed
  favicon: '' // The URL's favicon
}

const mutations = {
  /** Sets the Site Title (via iFrame)
   * @param  {} state
   * @param  {} val
   */
  changeSiteData(state, val) {
    if (!val) throw new Error('No value')

    // @TODO: Throttle this fn, as it will be called by
    // each <webview> when it loads, and doesn't need to keep changing

    if (val.title && val.title !== this.state.site.title) {
      this.state.site.title = val.title
    }

    if (val.url) {
      // if (val.url !== state.site.url) {
      this.state.site.url = val.url // Update the URL based on the incoming value
      // }
    }

    if (val.favicon) {
      this.state.site.favicon = val.favicon // Update the URL based on the incoming value
    }
  }
}

export default {
  state,
  mutations
}