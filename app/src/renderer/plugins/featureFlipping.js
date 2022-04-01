import Vue from 'vue'
import FeatureFlipping, { setEnabledFeatures } from 'vue-feature-flipping'

Vue.use(FeatureFlipping)

// Set the enabled features
setEnabledFeatures(['focus-mode', 'disco-switch'])
