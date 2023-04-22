// Vite-based SVG icon storage & loader
// Inspired by https://github.com/damianstasik/vue-svg-loader/issues/180#issuecomment-1344320704
import { defineStore } from 'pinia'

export const useIconStore = defineStore('icons', {
  state: () => {
    return {
      icons: [Object],
    }
  },
  actions: {
    async fetchIcons() {
      const icons = Object.fromEntries(
        Object.entries(
          import.meta.glob('@/assets/icons/*.svg', { as: 'raw' })
        ).map(([key, value]) => {
          const filename = key.split('/').pop()!.split('.').shift()
          return [filename, value]
        })
      )

      this.icons = icons
    },
  },
})
