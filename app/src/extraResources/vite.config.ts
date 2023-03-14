import { defineConfig } from 'vite'
import path from 'path'
import target from 'vite-plugin-target'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: path.resolve(__dirname, '../../dist/extraResources'),
    lib: {
      entry: path.resolve(__dirname, './inject.ts'),
      name: 'injectScript',
      fileName: (format) => `index.js`,
      formats: ['cjs'], // TODO: Use ESM
    },
    minify: false,
    rollupOptions: {
      // Externalize deps that shouldn't be bundled into your library
      external: ['electron', 'fs', 'fs/promises'],
    },
  },
  // Build for Electron `preload` script
  // https://github.com/vite-plugin/vite-plugin-target#usage
  plugins: [
    target({
      'electron-main': {},
    }),
  ],
})
