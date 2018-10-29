<template>
  <div id="app">
    <Toolbar/>
    <div id="canvas-container">
      <div id="canvas" ref="canvas">
        <Artboards/>
      </div>
    </div>
  </div>
</template>

<script>
import Toolbar from "./components/Toolbar.vue";
import Artboards from "./components/Artboards.vue";
import panzoom from "panzoom"

export default {
  name: "app",
  components: {
    Artboards, // TODO: This should be inside of </Canvas>
    Toolbar
    // TODO: Create Settings
  },
  mounted() {
    // Attach panzoom (pan + zoom-able canvas)
    document.panzoomInstance = panzoom(this.$refs.canvas);
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

#canvas-container {
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
  height: 100%;
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translateZ(0); // Activate GPU rendering
}
</style>