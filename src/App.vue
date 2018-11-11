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