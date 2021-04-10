import vue from '@vitejs/plugin-vue'
import type { UserConfig } from 'vite'
const path = require('path')

// Vite's Library Mode
// https://vitejs.dev/guide/build.html#library-mode
// https://github.com/quatrochan/Equal/blob/master/vite.config.ts

const config: UserConfig = {
  alias: [
    {
      find: '@',
      replacement: path.resolve(__dirname, 'src'),
    },
  ],
  plugins: [vue()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'Equal',
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
}

export default config
