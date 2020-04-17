<template>
  <div id="focus-view">
    <div class="canvasContainer">
      <SidePanel />
      <Screenshots />
      <div class="focus-view__content">
        <Panzoom id="canvas">
          <FocusArtboard ref="artboards" />
        </Panzoom>
        <!-- <DiscoSwitch /> -->
        <SizeShifter />
        <!-- <DevToolsView /> -->
      </div>
    </div>
  </div>
</template>

<script>
import Panzoom from '@/components/panzoom/Panzoom.vue'
import SidePanel from '@/components/SidePanel'
import Screenshots from '@/components/Screenshot'
import FocusArtboard from '@/components/FocusMode/FocusArtboard'
import SizeShifter from '@/components/FocusMode/SizeShifter'
import DiscoSwitch from '@/components/FocusMode/DiscoSwitch'
import DevToolsView from '@/components/DevToolsView'

export default {
  name: 'FocusView',
  components: {
    Panzoom,
    FocusArtboard,
    SidePanel,
    Screenshots,
    SizeShifter,
    DiscoSwitch,
    DevToolsView,
  },
  data() {
    return {}
  },
  mounted() {
    this.panzoomInstance = this.$root.$panzoom
  },
  methods: {},
}
</script>

<style lang="scss">
// Make global styles available
@import '@/scss/_global';
</style>

<style lang="scss" scoped>
@import '@/scss/_variables';

.canvasContainer {
  background: $body-bg;
  height: calc(
    100vh - #{$gui-title-bar-height}
  ); // hard-coded height of toolbar
  position: relative;
  // display: flex;
}

// .focus-view__content {
//   width: 100%;

//   // #canvas {
//   //   display: flex;
//   //   position: absolute;
//   //   // align-items: center;
//   //   // justify-content: center;
//   //   // width: 100%;
//   //   // height: 100%;
//   //   // top: 0;
//   //   // left: 0;
//   //   z-index: 0;
//   // }
// }
</style>
