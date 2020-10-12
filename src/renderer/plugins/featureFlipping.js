import Vue from "vue";
import FeatureFlipping from "vue-feature-flipping";
import { setEnabledFeatures } from "vue-feature-flipping";

Vue.use(FeatureFlipping);

// Set the enabled features
setEnabledFeatures([
  // "focus-mode"
]);
