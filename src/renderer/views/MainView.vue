<template>
  <div id="main-view">
    <ToolBar ref="toolbar" />
    <div id="canvasContainer">
      <SidePanel />
      <ArtboardControls />
      <div id="canvas" ref="canvas">
        <Artboards ref="artboards" />
      </div>
    </div>
  </div>
</template>

<script>
import ToolBar from "../components/ToolBar";
import Artboards from "../components/Artboards.vue";
import SidePanel from "../components/SidePanel";
import ArtboardControls from "../components/ArtboardControls.vue";
import panzoom from "../mixins/panzoom";

export default {
  name: "MainView",
  components: {
    Artboards,
    ArtboardControls,
    SidePanel,
    ToolBar
  },
  computed: {
    // Bind to our Vuex Store's URL value
    artboards: function() {
      return this.$store.state.artboards;
    }
  },
  mounted: function() {
    let vm = this;

    vm.$nextTick(() => {
      const contentEl = vm.$refs["artboards"].$el;
      const controllerEl = vm.$refs["canvas"];

      // Initialize Panzoom
      let instance = panzoom(contentEl, controllerEl, {
        startCentered: true
      });

      // Listen for changes
      // Commit them to the Vuex store
      instance.on('panzoom:zoom', () => {
        console.log('zoom');
        // TODO change store on zoom start
        // TODO change store on zoom end
        // vm.$store.commit('updatePanzoom', instance)
      })
      
      instance.on('panzoom:pan', () => {
        console.log('pan');
         // TODO change store on pan start
        // TODO change store on pan end
        // vm.$store.commit('updatePanzoom', instance)
      })
    });
  }
};
</script>

<style lang="scss">
// Make global styles available
@import "../scss/_global";
</style>

<style lang="scss" scoped>
@import "../scss/_variables";

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
  height: calc(100% - 44px); // hard-coded height of toolbar
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
      cursor: grab;
    }

    &:active {
      // cursor: grabbing;
    }
  }
}
</style>
