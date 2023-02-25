import { defineStore } from 'pinia'

interface State {
  pages: any[]
  currentPage: {
    index: number
    url: string
    title: string | null
    favicon: string | null
  }
}

export const useHistoryStore = defineStore('history', {
  state: (): State => ({
    pages: [],
    currentPage: {
      index: 0,
      url: '',
      title: null,
      favicon: null,
    },
  }),
  actions: {
    back() {
      this.setCurrentPageIndex('back')
    },
    forward() {
      this.setCurrentPageIndex('forward')
    },
    reload() {
      // TODO: Trigger reload!
    },
    updateHistory(payload) {
      Object.assign(this.pages, payload)
    },
    addPage(payload) {
      this.pages.push(payload)
    },
    setCurrentPageIndex(payload) {
      switch (payload) {
        case 'forward':
          this.currentPage.index = this.currentPage.index + 1
          break

        case 'back':
          this.currentPage.index = this.currentPage.index - 1
          break

        // If adding a new page (i.e. user has entered a URL in the search input bar)
        case 'new':
          this.currentPage.index = this.pages.length - 1 // zero indexed
          break

        // Allow to set to a specific index
        default:
          this.currentPage.index = payload
          break
      }
    },
    /** Sets the Site Title (via iFrame)
     * @param  {} state
     * @param  {} val
     */
    changeSiteData(val: { title?: string; url?: string; favicon?: string }) {
      if (!val) throw new Error('No value')
      // This function may be called just to trigger a new URL navigation
      // but it can also be called from an <artboard> once it has access to the new URL

      // @TODO: Throttle this fn, as it will be called by
      // each <webview> when it loads, and doesn't need to keep changing

      if (val.title && val.title !== this.currentPage.title) {
        this.currentPage.title = val.title
      }

      if (val.url) {
        this.currentPage.url = val.url // Update the URL based on the incoming value
      }

      if (val.favicon) {
        this.currentPage.favicon = val.favicon // Update the URL based on the incoming value
      }
    },
    addPageToHistory(payload) {
      this.addPage(payload) // Add to the array
      this.setCurrentPageIndex('new') // Update the current page
    },
  },
})
