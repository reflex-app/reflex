import { defineStore } from 'pinia'

export const useUrlsStore = defineStore({
  id: 'urls',
  state: () => ({
    urls: [] as Array<{ site: string; paths: Array<string> }>,
  }),
  actions: {
    addSite(site: string) {
      this.urls.push({
        site: addHttpsPrefix(site),
        paths: [],
      })
    },
    addPath(site: string, path: string) {
      const siteIndex = this.urls.findIndex((url) => url.site === site)
      if (siteIndex !== -1) {
        this.urls[siteIndex].paths.push(path)
      }
    },
    removeSite(site: string) {
      const siteIndex = this.urls.findIndex((url) => url.site === site)
      if (siteIndex !== -1) {
        this.urls.splice(siteIndex, 1)
      }
    },
    removePath(site: string, path: string) {
      const siteIndex = this.urls.findIndex((url) => url.site === site)
      if (siteIndex !== -1) {
        const pathIndex = this.urls[siteIndex].paths.findIndex(
          (p) => p === path
        )
        if (pathIndex !== -1) {
          this.urls[siteIndex].paths.splice(pathIndex, 1)
        }
      }
    },
    updateSite(oldSite: string, newSite: string) {
      const siteIndex = this.urls.findIndex((url) => url.site === oldSite)
      if (siteIndex !== -1) {
        this.urls[siteIndex].site = addHttpsPrefix(newSite)
      }
    },
    updatePath(site: string, oldPath: string, newPath: string) {
      const siteIndex = this.urls.findIndex((url) => url.site === site)
      if (siteIndex !== -1) {
        const pathIndex = this.urls[siteIndex].paths.findIndex(
          (p) => p === oldPath
        )
        if (pathIndex !== -1) {
          this.urls[siteIndex].paths[pathIndex] = newPath
        }
      }
    },
  },
  persist: true,
})

function addHttpsPrefix(site: string) {
  if (!site.startsWith('http://') && !site.startsWith('https://')) {
    return `https://${site}`
  }
  return site
}
