// Event Buses are great for global events outside of Vuex
// https://medium.com/js-dojo/vue-js-manage-your-modal-window-s-effortlessly-using-eventbus-518977195eed
// via https://binbytes.com/blog/create-global-event-bus-in-nuxtjs

import Vue from 'vue'

/**
 * webpageSyncBus
 * Used in WebPage to communicate synchronizations
 * between other WebPages
 */
export const webpageSyncBus = new Vue()

/**
 * Communicate app-level events
 */
export const fullScreenWebPage = new Vue()
