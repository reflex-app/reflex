// Vite-based SVG icon storage & loader
// Inspired by https://github.com/damianstasik/vue-svg-loader/issues/180#issuecomment-1344320704
import { defineStore } from 'pinia'
import path from 'path'

export const useIconStore = defineStore('icons', {
  state: () => {
    return {
      icons: [],
    }
  },
  actions: {
    async fetchIcons() {
      // TODO: Add test for this
      const icons = Object.fromEntries(
        Object.entries(
          import.meta.glob('@/assets/icons/**/*.svg', { as: 'raw' })
        ).map(([key, value]) => {
          const relativePath = path.relative('/assets/icons', key)
          const keyString = relativePath
            .replace(/^(\.\.\/)+/, '') // Remove leading ../
            .replace(/\.svg$/, '') // Remove .svg extension

          // Return an array with the directory/filename pair as the key/value
          return [keyString, value]
        })
      )

      this.icons = icons
    },
  },
})
