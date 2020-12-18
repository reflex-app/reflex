import Vue from 'vue'
import { setEnabledFeatures } from FeatureFlipping from "vue-feature-flipping";


Vue.use(FeatureFlipping)

// Set the enabled features
setEnabledFeatures([
  // "focus-mode"
  // "disco-switch"
])
