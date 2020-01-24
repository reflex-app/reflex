<template>
  <div id="focus-view">
    <div class="canvasContainer">
      <SidePanel />
      <Screenshots />
      <div class="focus-view__content">
        <!-- <DiscoSwitch /> -->
        <div id="canvas" ref="canvas">
          <FocusArtboard ref="artboards"/>
        </div>
        <SizeShifter />
        <!-- <DevToolsView /> -->
      </div>
    </div>
  </div>
</template>

<script>
import { Panzoom } from "../mixins/panzoom";
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
      const controllerEl = this.$refs["canvas"];
      const contentEl = this.$refs["artboards"].$el;

      // Initialize Panzoom
      let instance = new Panzoom(contentEl, controllerEl, {
        startCentered: true
      });
      document.$panzoom = instance; // Attach to document

      // Listen for changes
      instance
        .on("zoomStart", () => {
          this.$store.commit("interactionSetState", {
            key: "isZooming",
            value: true
          });
        })
        .on("panStart", () => {
          this.$store.commit("interactionSetState", {
            key: "isPanning",
            value: true
          });
        })
        .on("zoomStop", () => {
          this.$store.commit("interactionSetState", {
            key: "isZooming",
            value: false
          });
        })
        .on("panStop", () => {
          this.$store.commit("interactionSetState", {
            key: "isPanning",
            value: false
          });
        });

      // Listen for menu bar events
      // TODO Add tests for these
      if (isElectron()) {
        ipcRenderer.on("menu_zoom-to-fit", document.$panzoom.fitToScreen());
        ipcRenderer.on("menu_zoom-in", document.$panzoom.zoomIn());
        ipcRenderer.on("menu_zoom-out", document.$panzoom.zoomOut());
        ipcRenderer.on("menu_show-developer-canvas-debugger", () => {
          this.$store.commit("toggleCanvasDebugger");
        });
      }

      // Listen for View to be destroyed
      this.$once("hook:beforeDestroy", () => {
        // TODO remove listeners
      });
    }
  },
  mounted: function() {
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
