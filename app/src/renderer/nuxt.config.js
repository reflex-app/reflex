/**
 * By default, Nuxt.js is configured to cover most use cases.
 * This default configuration can be overwritten in this file
 * @link {https://nuxtjs.org/guide/configuration/}
 */

module.exports = {
  ssr: false, // https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-ssr
  target: 'static',
  head: {
    title: 'Reflex',
  },
  loading: false,
  plugins: [
    { src: '~/plugins/vueCompositionApi.js', ssr: false },
    { src: '~/plugins/vuex-persist.js', ssr: false },
    { src: '~/plugins/eventBus.js', ssr: false },
    { src: '~/plugins/globalComponents.js', ssr: false },
    { src: '~/plugins/featureFlipping.js', ssr: false },
    { src: '~/plugins/reflex-ui.js', ssr: false },
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    // '@nuxtjs/eslint-module',
    '@nuxt/typescript-build',
  ],
  build: {
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
}
