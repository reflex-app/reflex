// import vuetify from 'vite-plugin-vuetify'
import renderer from 'vite-plugin-electron-renderer'
import { comlink } from 'vite-plugin-comlink'

import type { ElectronOptions } from 'nuxt-electron'

const isDevMode = process.env.NODE_ENV !== 'production'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  components: false,
  router: {
    options: {
      hashMode: true,
    },
  },

  vite: {
    optimizeDeps: {
      exclude: ['fsevents', '@playwright/test', 'playwright', 'playwright-core'],
    },
    server: {
      middlewareMode: false,
    },
    plugins: [
      // Enable Web Worker support <> Vite <> Comlink
      comlink(),
      // Enable Node modules in renderer process
      renderer({
        nodeIntegration: true,
      }),
    ],
    worker: {
      plugins: [comlink()],
    },
  },
  // Environment variables
  runtimeConfig: {
    public: {
      DEV: isDevMode,
    },
  },

  // TODO: Considering moving all Nuxt files to a subfolder
  // srcDir: './nuxt/',
  app: {
    baseURL: './',
  },
  modules: [
    // async (options, nuxt) => {
    //   // @ts-expect-error: remove ts error
    //   nuxt.hooks.hook('vite:extendConfig', (config) =>
    //     config.plugins.push(vuetify())
    //   )
    // },
    // Nuxt + Electron configuration
    // Docs: https://github.com/caoxiemeihao/nuxt-electron
    // Example: https://github.com/gurvancampion/nuxt-electron-trpc-prisma/
    [
      'nuxt-electron',
      <ElectronOptions>{
        include: ['electron', 'server', 'extraResources'],
        // root: __dirname + '/nuxt',
      },
    ],
    '@pinia/nuxt', // Use Pinia w/ Nuxt 3
    [
      // Persisted state w/ Pinia + Nuxt (Nuxt 3)
      '@pinia-plugin-persistedstate/nuxt',
      {
        storage: 'localStorage', // Use localStorage as default storage
      },
    ],
  ],
  // Vue settings
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => ['webview'].includes(tag),
    },
  },
  hooks: {
    // Remove aliases to only have one
    // https://github.com/nuxt/framework/issues/7277
    'prepare:types': function ({ tsConfig }) {
      const aliasesToRemoveFromAutocomplete = [
        '~~',
        '~~/*',
        '@',
        '@/*',
        '@@',
        '@@/*',
      ]
      for (const alias of aliasesToRemoveFromAutocomplete) {
        if (tsConfig.compilerOptions!.paths[alias])
          delete tsConfig.compilerOptions!.paths[alias]
      }
    },
  },

  // Tailwind CSS
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})
