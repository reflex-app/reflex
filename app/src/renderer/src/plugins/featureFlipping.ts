import FeatureFlipping, { setEnabledFeatures } from 'vue-feature-flipping'

export default defineNuxtPlugin((nuxtApp) => {
  // Install the plugin
  nuxtApp.vueApp.use(FeatureFlipping)

  // Set the enabled features
  setEnabledFeatures([
    // "focus-mode"
    // "disco-switch"
  ])
})
