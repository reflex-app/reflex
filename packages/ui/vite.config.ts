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
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'ReflexInterface', // The name for the default function
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
})
