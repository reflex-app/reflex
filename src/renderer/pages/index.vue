<template>
  <div id="focus-view">
    <div class="canvasContainer">
      <SidePanel />
      <Screenshots />
      <div class="focus-view__content">
        <Panzoom id="canvas">
          <FocusArtboard ref="artboards" />
        </Panzoom>
        <div v-feature-flipping="'disco-switch'">
          <DiscoSwitch />
        </div>
        <SizeShifter />
        <!-- <DevToolsView /> -->
      </div>
    </div>
  </div>
</template>

<script>
import Panzoom from "@/components/Panzoom";
import SidePanel from "@/components/SidePanel";
import Screenshots from "@/components/Screenshot";
import FocusArtboard from "@/components/FocusMode/FocusArtboard";
import SizeShifter from "@/components/FocusMode/SizeShifter";
import DiscoSwitch from "@/components/FocusMode/DiscoSwitch";
import DevToolsView from "@/components/DevToolsView";

export default {
  name: "FocusView",
  components: {
    Panzoom,
    FocusArtboard,
    SidePanel,
    Screenshots,
    SizeShifter,
    DiscoSwitch,
    DevToolsView
  },
  data() {
    return {};
  },
  methods: {},
  mounted: function() {
    this.panzoomInstance = this.$root.$panzoom;
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
  // display: flex;
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

.page-enter-active {
  transition: all 250ms ease-in-out;
}
.page-enter {
  opacity: 0;
  transform: scale(0);
}

.page-leave-active {
  transition: all 150ms ease-in-out;
}
.page-leave-to {
  opacity: 0;
  transform: scale(0.75);
}
</style>
