/**
 * By default, Nuxt.js is configured to cover most use cases.
 * This default configuration can be overwritten in this file
 * @link {https://nuxtjs.org/guide/configuration/}
 */


module.exports = {
  mode: 'spa', // or 'universal'
  head: {
    title: 'Reflex'
  },
  loading: false,
  plugins: [
    { src: '~/plugins/vuex-persist', ssr: false },
    '~/plugins/globalComponents.js'
  ]
};
