<template>
  <div id="app">
    <Toolbar ref="toolbar"/>
    <div id="canvasContainer">
      <ArtboardList v-if="artboards.length"/>
      <ArtboardControls/>
      <div id="canvas" ref="canvas">
        <Artboards ref="artboards"/>
      </div>
    </div>
  </div>
</template>

<script>
import Toolbar from "./components/Toolbar.vue";
import Artboards from "./components/Artboards.vue";
import ArtboardList from "./components/ArtboardList.vue";
import ArtboardControls from "./components/ArtboardControls.vue";
import panzoom from "panzoom";

export default {
  name: "app",
  components: {
    Artboards,
    ArtboardControls,
    ArtboardList,
    Toolbar
    // TODO: Settings component
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
  },
  computed: {
    // Bind to our Vuex Store's URL value
    artboards: function() {
      return this.$store.state.artboards;
    }
  }
};
</script>

<style lang="scss">
// Make global styles available
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
  overflow: hidden;
  overscroll-behavior: auto;
  border-radius: 8px;
  background: $body-bg;
}

#canvasContainer {
  background: $body-bg;
  height: calc(100% - 44px); // hard-coded height of toolbar
  width: 100%;
  position: relative;

  #canvas {
    height: 100%;
    width: 100%;
    position: absolute;
    overflow: hidden;
    outline: none;

    &:hover {
      cursor: grab;
    }

    &:active {
      cursor: grabbing;
    }
  }
}
</style>