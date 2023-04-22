// https://nuxt.com/docs/api/configuration/nuxt-config
// import path from 'path'
const isDevMode = process.env.NODE_ENV !== 'production'

export default defineNuxtConfig({
  ssr: false, // Client-side-only rendering

  // Hash mode for router w/ Electron
  router: {
    options: {
      hashMode: true,
    },
  },

  // Nuxt directory settings
  srcDir: './src/',
  app: {
    baseURL: './',
  },

  // App title
  head: {
    title: 'Reflex',
  },

  // Environment variables
  runtimeConfig: {
    public: {
      DEV: isDevMode,
    },
  },

  // Vite settings
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          sourceMap: true,
          // additionalData : `@import "@/assets/mixin.scss";`,
        },
      },
    },
  },

  loading: false,

  /*
   ** Nuxt.js dev-modules
   */
  modules: [
    '@pinia/nuxt', // Use Pinia w/ Nuxt 3
    '@pinia-plugin-persistedstate/nuxt', // Persisted state w/ Pinia + Nuxt (Nuxt 3)
    // Doc: https://github.com/nuxt-community/eslint-module
    // '@nuxtjs/eslint-module',
    // '@nuxt/typescript-build',
  ],
  // Nuxt + Typescript
  // typescript: {
  //   /**
  //    * !! WARN !!
  //    * Dangerously allow production builds to successfully complete even if
  //    * your project has type errors.
  //    * via: https://github.com/nuxt/typescript/issues/486#issuecomment-948023713
  //    *
  //    * This will show us errors on dev, but not stop builds for production
  //    */
  //   typeCheck: isDevMode,
  // },
  // plugins: [
  //   // Persisted localStorage of Pinia Store states
  //   // https://github.com/iendeavor/pinia-plugin-persistedstate-2#with-localstorage-client-only-nuxt2-example
  //   { src: '~/plugins/eventListenerDebug', mode: 'client' },
  //   { src: '~/plugins/pinia-persisted-state', mode: 'client' },
  //   { src: '~/plugins/eventBus', mode: 'client' },
  //   { src: '~/plugins/globalComponents', mode: 'client' },
  //   { src: '~/plugins/featureFlipping', mode: 'client' },
  //   // { src: '~/plugins/reflex-ui', mode:'client' }, // Disabled until Nuxt v3 (w/ Vue 3)
  //   // { src: '~/plugins/vueCompositionApi', mode:'client' },
  //   // { src: '~/plugins/vuex-persist', mode:'client' },
  // ],

  // nitro: {
  //   externals: ['electron'],
  // },

  build: {
    transpile: ['@viselect/vanilla'],
    extend(config, { isDev, isClient }) {
      // ..
      // Comlink loader
      // https://github.com/GoogleChromeLabs/comlink-loader#singleton-mode
      config.module.rules.push({
        test: /\.worker\.(js|ts)$/i,
        loader: 'comlink-loader',
        options: {
          singleton: true,
        },
      })

      // Using WebPack to bundle Playwright/Puppeteer
      // https://stackoverflow.com/a/53744505/1114901
      // if (!config.externals) config.externals = {}
      // config.externals = {
      //   'playwright-core': 'playwright-core',
      // }
    },
  },
})