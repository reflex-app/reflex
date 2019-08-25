<template>
  <div id="main-view">
    <ToolBar ref="toolbar" />
    <div id="canvasContainer">
      <SidePanel />
      <Screenshots />
      <div id="canvas" ref="canvas">
        <Artboards ref="artboards" />
      </div>
    </div>
  </div>
</template>

<script>
import ToolBar from "@/components/ToolBar";
import Artboards from "@/components/Screens/Artboards";
import SidePanel from "@/components/SidePanel";
import Screenshots from "@/components/Screenshot";
import { mapState } from "vuex";
import { Panzoom } from "../mixins/panzoom";
import { ipcRenderer } from "electron";
import isElectron from "is-electron";

export default {
  name: "MainView",
  components: {
    Artboards,
    SidePanel,
    ToolBar,
    Screenshots
  },
  computed: {
    ...mapState({
      artboards: state => state.artboards
    })
  },
  mounted: function() {
    let vm = this;

    vm.$nextTick(() => {
      const parentEl = vm.$refs["canvas"];
      const childEl = vm.$refs["artboards"].$el;

      // Initialize Panzoom
      let instance = new Panzoom(parentEl, childEl, {
        startCentered: true
      });
      document.$panzoom = instance; // Attach to document

      // Listen for changes
      // Commit them to the Vuex store
      instance
        .on("zoomStart", () => {
          this.$store.commit("interactionSetState", {
            key: "isZooming",
            value: true
          });
        })
        .on("zoomStop", () => {
          this.$store.commit("interactionSetState", {
            key: "isZooming",
            value: false
          });
        })
        .on("panStart", () => {
          this.$store.commit("interactionSetState", {
            key: "isPanning",
            value: true
          });
        })
        .on("panStop", () => {
          this.$store.commit("interactionSetState", {
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
</style>
