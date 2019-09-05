<template>
  <div id="focus-view">
    <div class="canvasContainer">
      <!-- <SidePanel /> -->
      <Screenshots />
      <div class="focus-view__content">
        <SizeShifter />
        <div id="canvas" ref="canvas">
          <FocusArtboard ref="artboards" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { Panzoom } from "../mixins/panzoom";
import { ipcRenderer } from "electron";
import isElectron from "is-electron";
import FocusArtboard from "@/components/Screens/FocusArtboard";
import SidePanel from "@/components/SidePanel";
import Screenshots from "@/components/Screenshot";
import SizeShifter from "@/components/FocusMode/SizeShifter";
const isDev = require("electron-is-dev");

export default {
  name: "FocusView",
  components: {
    FocusArtboard,
    SidePanel,
    Screenshots,
    SizeShifter
  },
  data() {
    return {
      isDev: isDev
    };
  },
  computed: {},
  mounted: function() {}
};
</script>

<style lang="scss">
// Make global styles available
@import "@/scss/_global";
</style>

<style lang="scss" scoped>
@import "@/scss/_variables";

.canvasContainer {
  background: $body-bg;
  height: calc(
    100vh - #{$gui-title-bar-height}
  ); // hard-coded height of toolbar
  position: relative;
  display: flex;
}

.focus-view__content {
  width: 100%;

  #canvas {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
  }
}
</style>
