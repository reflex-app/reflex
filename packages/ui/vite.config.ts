process.env.VUE_APP_VERSION = process.env.npm_package_version

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import path from 'path'

// Vite's Library Mode
// https://vitejs.dev/guide/build.html#library-mode
// https://github.com/quatrochan/Equal/blob/master/vite.config.ts

export default defineConfig({
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src'),
      },
    ],
  },
  plugins: [vue()],
  build: {
    // TODO Enable watch mode w/ Vite and Rollup
    // based on unreleased documentation: https://github.com/ygj6/vite/commit/d185ac3665e3186f04b655128389c094211eebd3
    // Should drop in >2.1.5
    // watch: {},
    // https://vitejs.dev/config/#build-lib
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'ReflexUI', // The name for the default function
    },
    // Rollup options
    // https://rollupjs.org/guide/en/#big-list-of-options
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        name: 'reflex', // https://rollupjs.org/guide/en/#outputname
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
