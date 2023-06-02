import { defineStore } from 'pinia'

interface Path {
  path: string
  children: Path[]
}

interface Url {
  site: string
  paths: Path[]
}

export const useUrlsStore = defineStore({
  id: 'urls',
  state: () => ({
    urls: [] as Url[],
    // urls: [] as Array<{ site: string; paths: Array<string> }>,
  }),
  actions: {
    addSite(site: string) {
      this.urls.push({ site: addHttpsPrefix(site), paths: [] })
    },
    addPath(site: string, path: string) {
      const siteIndex = this.urls.findIndex((url) => url.site === site)
      if (siteIndex !== -1) {
        const subPaths = path.split('/').filter((p) => p)
        let currentPaths = this.urls[siteIndex].paths
        for (const subPath of subPaths) {
          let subPathIndex = currentPaths.findIndex((p) => p.path === subPath)
          if (subPathIndex === -1) {
            subPathIndex =
              currentPaths.push({ path: subPath, children: [] }) - 1
          }
          currentPaths = currentPaths[subPathIndex].children
        }
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
        const subPaths = path.split('/').filter((p) => p)
        let currentPaths = this.urls[siteIndex].paths
        for (let i = 0; i < subPaths.length; i++) {
          const subPathIndex = currentPaths.findIndex(
            (p) => p.path === subPaths[i]
          )
          if (subPathIndex !== -1) {
            if (i === subPaths.length - 1) {
              currentPaths.splice(subPathIndex, 1)
            } else {
              currentPaths = currentPaths[subPathIndex].children
            }
          }
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
        const oldSubPaths = oldPath.split('/').filter((p) => p)
        const newSubPaths = newPath.split('/').filter((p) => p)
        let currentPaths = this.urls[siteIndex].paths
        for (let i = 0; i < oldSubPaths.length; i++) {
          const subPathIndex = currentPaths.findIndex(
            (p) => p.path === oldSubPaths[i]
          )
          if (subPathIndex !== -1) {
            if (i === oldSubPaths.length - 1) {
              currentPaths[subPathIndex].path = newSubPaths[i]
            } else {
              currentPaths = currentPaths[subPathIndex].children
            }
          }
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
