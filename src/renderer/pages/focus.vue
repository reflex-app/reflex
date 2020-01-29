<template>
  <div id="focus-view">
    <div class="canvasContainer">
      <SidePanel />
      <Screenshots />
      <div class="focus-view__content">
        <div id="canvas" ref="canvas">
          <FocusArtboard ref="artboards" />
        </div>
        <!-- <DiscoSwitch /> -->
        <SizeShifter />
        <!-- <DevToolsView /> -->
      </div>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
import isElectron from "is-electron";
import SidePanel from "@/components/SidePanel";
import Screenshots from "@/components/Screenshot";
import FocusArtboard from "@/components/FocusMode/FocusArtboard";
import SizeShifter from "@/components/FocusMode/SizeShifter";
import DiscoSwitch from "@/components/FocusMode/DiscoSwitch";
import DevToolsView from "@/components/DevToolsView";
const isDev = require("electron-is-dev");

export default {
  name: "FocusView",
  components: {
    FocusArtboard,
    SidePanel,
    Screenshots,
    SizeShifter,
    DiscoSwitch,
    DevToolsView
  },
  data() {
    return {
      isDev: isDev
    };
  },
  methods: {
    enableEventListeners() {
      this.panzoomInstance
        .on("zoomStart", () => {
          this.$store.commit("interactions/interactionSetState", {
            key: "isZooming",
            value: true
          });
        })
        .on("panStart", () => {
          this.$store.commit("interactions/interactionSetState", {
            key: "isPanning",
            value: true
          });
        })
        .on("zoomStop", () => {
          this.$store.commit("interactions/interactionSetState", {
            key: "isZooming",
            value: false
          });
        })
        .on("panStop", () => {
          this.$store.commit("interactions/interactionSetState", {
            key: "isPanning",
            value: false
          });
        });

      // Listen for menu bar events
      // TODO Add tests for these
      if (isElectron()) {
        ipcRenderer.on("menu_zoom-to-fit", this.$root.$panzoom.fitToScreen);
        ipcRenderer.on("menu_zoom-in", this.$root.$panzoom.zoomIn);
        ipcRenderer.on("menu_zoom-out", this.$root.$panzoom.zoomOut);
        ipcRenderer.on("menu_show-developer-canvas-debugger", () => {
          this.$store.commit("dev/toggleCanvasDebugger");
        });
      }

      // Listen for View to be destroyed
      this.$once("hook:beforeDestroy", () => {
        // TODO remove listeners
      });
    }
  },
  mounted: function() {
    this.panzoomInstance = this.$root.$panzoom;
    console.log(this.panzoomInstance);

    // Add event listeners
    this.$nextTick(this.enableEventListeners);
  }
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
    position: absolute;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 0;
  }
}
</style>
