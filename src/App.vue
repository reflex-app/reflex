<template>
  <div id="app">
    <Toolbar ref="toolbar"/>
    <div id="canvas-container">
      <div id="canvas" ref="canvas">
        <Artboards ref="artboards"/>
      </div>
    </div>
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
      const width = window.innerWidth / (this.$refs.artboards.$el.clientWidth / 2);
      // eslint-disable-next-line 
      console.log(width);
      
      return Number(width);
    },
    contentHeight() {
      const otherElements = this.$refs.toolbar.$el.clientHeight;
      const height =
        window.innerHeight / this.$refs.artboards.$el.clientHeight +
        otherElements;
      return Number(height);
    },
    minZoom() {
      return Number(Math.min(this.contentWidth(), this.contentHeight()));
    }
    // TODO: Add currentZoomScale() to Vuex store
    // currentZoomScale() {
    //   return document.panzoomInstance.getTransform();
    // }
  },
  mounted() {
    // Attach panzoom (pan + zoom-able canvas)
    document.panzoomInstance = panzoom(this.$refs.canvas, {
      maxZoom: 1,
      minZoom: 0.1
    });

    // Start by zooming in
    // TODO: This currently doesn't calculate the correct height
    document.panzoomInstance.zoomAbs(
      this.contentWidth(),
      this.contentHeight(),
      this.minZoom()
    );
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