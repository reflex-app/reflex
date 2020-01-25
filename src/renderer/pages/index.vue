<template>
  <div id="main-view">
    <ToolBar ref="toolbar" />
    <div id="canvasContainer">
      <SidePanel />
      <Screenshots />
      <div id="canvas" ref="canvas" :class="{ 'dev-visual-debugger': showCanvasDebugger }">
        <Artboards ref="artboards" :class="{ 'dev-visual-debugger': showCanvasDebugger }" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { Panzoom } from "../mixins/panzoom";
import { ipcRenderer } from "electron";
import isElectron from "is-electron";
import ToolBar from "@/components/ToolBar";
import Artboards from "@/components/Screens/Artboards";
import SidePanel from "@/components/SidePanel";
import Screenshots from "@/components/Screenshot";
const isDev = require("electron-is-dev");

export default {
  name: "MainView",
  components: {
    Artboards,
    SidePanel,
    ToolBar,
    Screenshots
  },
  data() {
    return {
      isDev: isDev
    };
  },
  computed: {
    ...mapState(["artboards"]),
    ...mapState({
      showCanvasDebugger: state => state.dev.showCanvasDebugger
    })
  },
  mounted: function() {
    let vm = this;

    this.$nextTick(() => {
      const controllerEl = vm.$refs["canvas"];
      const contentEl = vm.$refs["artboards"].$el;

      // Initialize Panzoom
      let instance = new Panzoom(contentEl, controllerEl, {
        startCentered: true
      });
      document.$panzoom = instance; // Attach to document

      // Listen for changes
      // Commit them to the Vuex store
      instance
        // Start
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
        // Stop
        /* Trigger a recalculation() event
         ** This will tell Artboards to update their
         ** x/y coordinates
         */
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
    });

    // Listen for menu bar events
    // TODO Add tests for these
    if (isElectron()) {
      ipcRenderer.on("menu_zoom-to-fit", () => {
        document.$panzoom.fitToScreen();
      });

      ipcRenderer.on("menu_zoom-in", () => {
        document.$panzoom.zoomIn();
      });

      ipcRenderer.on("menu_zoom-out", () => {
        document.$panzoom.zoomOut();
      });
      
      ipcRenderer.on("menu_show-developer-canvas-debugger", () => {
        this.$store.commit("dev/toggleCanvasDebugger");
      });
    }
  }
};
</script>

<style lang="scss">
// Make global styles available
@import "@/scss/_global";
</style>

<style lang="scss" scoped>
@import "@/scss/_variables";

#main-view {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  overflow: hidden;
  overscroll-behavior: auto;
  border-radius: 8px;
  background: $body-bg;
}

#canvasContainer {
  background: $body-bg;
  height: calc(100% - #{$gui-title-bar-height}); // hard-coded height of toolbar
  width: 100%;
  position: relative;
  display: flex;

  #canvas {
    height: 100%;
    width: 100%;
    position: absolute;
    overflow: hidden;
    outline: none;

    &:hover {
      // cursor: grab;
    }

    &:active {
      // cursor: grabbing;
    }
  }
}

.dev-visual-debugger {
  &:before,
  &:after {
    position: absolute;
    height: 100%;
    width: 100%;
    content: "";
    z-index: 1;
    pointer-events: none;
  }

  // Vertical line
  &:before {
    left: 50%;
    border-left: 1px solid red;
  }

  // Horizonal line
  &:after {
    top: 50%;
    border-top: 1px solid red;
  }

  // Nested debugger
  .dev-visual-debugger {
    // Vertical line
    &:before {
      left: 50%;
      border-left: 1px solid green;
    }

    // Horizonal line
    &:after {
      top: 50%;
      border-top: 1px solid green;
    }
  }
}
</style>
