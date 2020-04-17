<template>
  <div class="container" :class="{ 'dev-visual-debugger': showCanvasDebugger }">
    <PanzoomControls :instance="this.panzoomInstance" />
    <div ref="parent" :class="{ 'dev-visual-debugger': showCanvasDebugger }">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Panzoom from "@panzoom/panzoom";
import PanzoomControls from "./PanzoomControls.vue";
import { mapState } from "vuex";
import { ipcRenderer } from "electron";
import isElectron from "is-electron";
const isDev = require("electron-is-dev");

export default {
  components: {
    PanzoomControls
  },
  data() {
    return {
      isDev: isDev,
      DOMElement: null,
      panzoomInstance: {}
    };
  },
  computed: {
    ...mapState({
      showCanvasDebugger: state => state.dev.showCanvasDebugger
    })
  },
  mounted() {
    const vm = this;

    // Initialize
    this.DOMElement = this.$refs.parent;
    this.$root.$panzoom = Panzoom(this.DOMElement, {
      canvas: true, // Allows parent to control child
      cursor: "default"
    });

    // Reference inside of this component
    this.panzoomInstance = this.$root.$panzoom;

    // Enable event listeners
    this.$nextTick(() => {
      this.enableEventListeners();
    });
  },
  methods: {
    enableEventListeners() {
      const instance = this.panzoomInstance;
      const element = this.DOMElement;
      const vm = this;

      // element.addEventListener("panzoomchange", event => {
      //   console.log(event.detail); // => { x: 0, y: 0, scale: 1 }
      // });

      // TODO Add tests for these

      // Handle mouse & touch events
      this.mouseHandlers(element, instance, vm);

      // Mousewheel zoom w/ CMD/CTRL key
      this.wheelHandler(element, instance);

      // Listen for menu bar events
      if (isElectron()) {
        ipcRenderer.on("menu_zoom-in", this.panzoomInstance.zoomIn);
        ipcRenderer.on("menu_zoom-out", this.panzoomInstance.zoomOut);
        // ipcRenderer.on("menu_zoom-to-fit", this.panzoomInstance.fitToScreen);
        ipcRenderer.on("menu_show-developer-canvas-debugger", () => {
          this.$store.commit("dev/toggleCanvasDebugger");
        });
      }
    },
    /**
     * Handles wheel events (i.e. mousewheel)
     * @param DOMElement DOM element that Panzoom is on
     * @param instance The Panzoom instance
     */
    wheelHandler(DOMElement, instance) {
      DOMElement.parentElement.addEventListener("wheel", function(event) {
        event.preventDefault();

        // Require the CMD/CTRL key to be pressed
        // This prevents accidental scrolling
        if (!event.metaKey) return;

        instance.zoomWithWheel(event);
      });
    },
    /**
     * Handles mouse and touch events
     * @param DOMElement DOM element that Panzoom is on
     * @param instance The Panzoom instance
     */
    mouseHandlers(DOMElement, instance, vm) {
      // Emit start events
      ["mousedown", "touchstart", "gesturestart"].forEach(name =>
        DOMElement.addEventListener(name, startEvents)
      );

      function startEvents(e) {
        vm.$store.commit("interactions/interactionSetState", {
          key: "isPanzooming",
          value: true
        });
      }

      // Emit end events
      ["mouseup", "touchend", "gestureend"].forEach(name =>
        DOMElement.addEventListener(name, endEvents)
      );

      function endEvents(e) {
        vm.$store.commit("interactions/interactionSetState", {
          key: "isPanzooming",
          value: false
        });
      }
    },
    fitToScreen() {
      // TODO Re-attach fitToScreen
      // this.panzoomInstance.fitToScreen();
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  // position: absolute;
  // overflow: hidden;
  // outline: none;
  // height: 100%;
  // width: 100%;
  height: 100%;
  width: 100%;
}

#parent {
  height: auto;
  width: auto;
  position: relative;
  display: inline-flex;
  flex-direction: row;
  flex-wrap: nowrap;
  user-select: none;
}

#child {
  height: 100%;
  width: 100%;
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
    left: 0;
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