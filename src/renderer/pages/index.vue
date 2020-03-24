<template>
  <div id="main-view">
    <SidePanel />
    <Screenshots />
    <Panzoom id="canvas">
      <Artboards />
    </Panzoom>
  </div>
</template>

<script>
import Artboards from "@/components/Screens/Artboards";
import SidePanel from "@/components/SidePanel";
import Screenshots from "@/components/Screenshot";
import Panzoom from "@/components/Panzoom";

export default {
  name: "MainView",
  components: {
    Artboards,
    SidePanel,
    Screenshots,
    Panzoom
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
  background: $body-bg;
  min-height: calc(
    100vh - #{$gui-title-bar-height}
  ); // hard-coded height of toolbar
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
