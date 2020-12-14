/**
 * By default, Nuxt.js is configured to cover most use cases.
 * This default configuration can be overwritten in this file
 * @link {https://nuxtjs.org/guide/configuration/}
 */

module.exports = {
  ssr: false, // https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-ssr
  head: {
    title: 'Reflex',
  },
  loading: false,
  plugins: [
    { src: '~/plugins/vuex-persist.js', ssr: false },
    { src: '~/plugins/eventBus.js', ssr: false },
    { src: '~/plugins/globalComponents.js', ssr: false },
    { src: '~/plugins/featureFlipping.js', ssr: false },
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    // '@nuxtjs/eslint-module',
  ],
}
