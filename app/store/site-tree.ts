import { defineStore } from 'pinia'

export const Status: { [key: number]: string } = {
  0: 'N/A',
  1: 'Not started',
  2: 'Next',
  3: 'In Progress',
  4: 'Pending',
  5: 'Completed',
  6: 'Cancelled',
}

export interface Path {
  path: string
  status: keyof typeof Status
  children: Path[]
}

interface Url {
  site: string
  paths: Path[]
}

export const useSiteTree = defineStore({
  id: 'urls',
  state: () => ({
    urls: [] as Url[],
  }),
  getters: {
    getStatusForPath: (state) => (site: string, path: string) => {
      const url = state.urls.find((url) => url.site === site)
      if (url) {
        const subPaths = path.split('/').filter((p) => p)
        let currentPaths = url.paths
        for (const subPath of subPaths) {
          const subPathObj = currentPaths.find((p) => p.path === subPath)
          if (subPathObj) {
            currentPaths = subPathObj.children
          } else {
            return null // Path not found
          }
        }
        const statusObj = currentPaths.find((p) => p.hasOwnProperty('status'))
        if (statusObj) {
          return Status[statusObj.status as number] // Return the status value
        }
      }
      return null // Site not found or status not available
    },
  },
  actions: {
    addSite(site: string) {
      const siteWithHttps = addHttpsPrefix(site)
      const siteAlreadyExists = this.urls.some(
        (url) => url.site === siteWithHttps
      )

      if (siteAlreadyExists) {
        return false
      }

      this.urls.push({ site: siteWithHttps, paths: [] })
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
              currentPaths.push({
                path: subPath,
                children: [],
                status: 0,
              }) - 1
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
    updateStatus(site: string, path: string, newStatus: number) {
      const url = this.urls.find((url) => url.site === site)
      if (url) {
        const subPath = findSubPath(url.paths, path)
        if (subPath) {
          const nestedPath = path.replace(subPath.path, '').slice(1)
          if (nestedPath) {
            const nestedSubPath = findSubPath(subPath.children, nestedPath)
            if (nestedSubPath) {
              nestedSubPath.status = newStatus
            }
          } else {
            subPath.status = newStatus
          }
        }
      }
    },
  },
  persist: true,
})

export default useSiteTree

function findSubPath(paths: Path[], path: string): Path | undefined {
  const subPaths = path.split('/').filter((p) => p)
  if (!subPaths.length) return undefined // No path provided

  let currentPaths: Path[] | undefined = paths
  for (const subPath of subPaths) {
    const foundPath = currentPaths?.find((p) => p.path === subPath)

    if (foundPath) {
      return foundPath
    } else {
      return undefined // Path not found
    }
  }
  // return currentPaths?.[0]
}

function addHttpsPrefix(site: string) {
  if (!site.startsWith('http://') && !site.startsWith('https://')) {
    return `https://${site}`
  }
  return site
}
