<template>
  <div id="app">
    <Toolbar ref="toolbar"/>
    <!-- <div id="canvas-container"> -->
      <div id="canvas" ref="canvas">
        <Artboards ref="artboards"/>
      </div>
    <!-- </div> -->
  </div>
</template>

<script>
import Toolbar from "./components/Toolbar.vue";
import Artboards from "./components/Artboards.vue";
import panzoom from "panzoom";

export default {
  name: "app",
  components: {
    Artboards, // TODO: This should be inside of </Canvas>
    Toolbar
    // TODO: Create Settings
  },
  methods: {
    contentWidth() {
      const width = window.innerWidth / this.$refs.artboards.$el.clientWidth;

      // eslint-disable-next-line
      console.log(width);

      return Number(width);
    },
    contentHeight() {
      const parentHeight = document.getElementById("canvas-container")
        .clientHeight;

      let childHeight = this.$refs.artboards.$el.getBoundingClientRect().height;

      const scaleFactor = parentHeight / childHeight;

      // 1. Check if the size is smaller/bigger than the canvas
      // What if the child doesn't fit inside of the parent? (too big)
      // Deal with the scale
      let output;
      if (childHeight > parentHeight) {
        // Need to scale down
        // We'll scale down the childHeight to a size that will fit a screen's width
        childHeight = parentHeight / 2; // 50% of the parent height
        output = parentHeight / 2 - childHeight / 2;
      } else if (childHeight < parentHeight) {
        // The canvas is too small, scale up
        // childHeight = childHeight * scaleFactor;
        output = parentHeight / 2;
      }

      // Step 2.
      // const output = (parentHeight / 2) - (childHeight / 2);
      // const output = parentHeight / 2;

      // (childHeight * (parentHeight  - padding ) ) / parentHeight
      // AKA the height of the child / the height of the parent
      // const output = childHeight * scaleFactor; // available space

      // const output = (childHeight * parentHeight) / parentHeight; // available space

      // eslint-disable-next-line
      console.log({ parentHeight, childHeight, output });

      return Number(output);
    },
    minZoom() {
      return Math.min(
        this.contentWidth(),
        document.getElementById("canvas-container").getBoundingClientRect()
          .height / 2
      );
      // return Math.min(this.contentWidth(), this.contentHeight());
    }
    // TODO: Add currentZoomScale() to Vuex store
    // currentZoomScale() {
    //   return document.panzoomInstance.getTransform();
    // }
  },
  mounted: function() {
    let vm = this;

    vm.$nextTick(() => {
      const myElement = vm.$refs["artboards"].$el;
      const myControllerEl = vm.$refs["canvas"];

      // Initialize Panzoom
      let instance = panzoom(myElement, myControllerEl, {
        startCentered: true
      });

      // Listen for changes
      // Commit them to the Vuex store
      instance.on("panzoom:change", () => {
        vm.$store.commit("updatePanzoom", instance);
      });
    });
  }
  // mounted() {

  //   this.$nextTick(() => {
  //     // Attach panzoom (pan + zoom-able canvas)
  //     document.panzoomInstance = panzoom(this.$refs.canvas, {
  //       maxZoom: 1,
  //       minZoom: 0.1,
  //       autoCenter: true
  //     });

  //     // document.panzoomInstance.zoomAbs(0, 0, this.minZoom());
  //     document.panzoomInstance.zoomAbs(0, this.contentHeight(), this.minZoom());
  //   });
  // }
};
</script>

<style lang="scss">
@import "./scss/_global";
</style>

<style lang="scss" scoped>
@import "./scss/_variables";

#app {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  background: $body-bg;
  overflow: hidden;
  overscroll-behavior: auto;
}

#canvas {
  background: $body-bg;
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
  outline: none;

  &:hover {
    cursor: grab;
  }

  &:active {
    cursor: grabbing;
  }
}

#canvas {
  position: relative;
  display: inline-block;
  transform: translateZ(0); // Activate GPU rendering
}
</style>