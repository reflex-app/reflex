/**
 * Event bus used by `<WebView>` to communicate with the Nuxt app (renderer process)
 */
// via https://binbytes.com/blog/create-global-event-bus-in-nuxtjs
// import Vue from 'vue'

import mitt from 'mitt'
const emitter = mitt()
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('bus', {
    $on: emitter.on,
    $off: emitter.off,
    $emit: emitter.emit,
  })
})
