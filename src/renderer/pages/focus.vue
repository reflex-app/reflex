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
import Panzoom from '@/components/panzoom/Panzoom.vue'
import SidePanel from '@/components/SidePanel'
import Screenshots from '@/components/Screenshot'
import FocusArtboard from '@/components/FocusMode/FocusArtboard'
import SizeShifter from '@/components/FocusMode/SizeShifter'
import DiscoSwitch from '@/components/FocusMode/DiscoSwitch'

export default {
  name: 'MainView',
  components: {
    Panzoom,
    FocusArtboard,
    SidePanel,
    Screenshots,
    DiscoSwitch,
    SizeShifter,
  },
}
</script>

<style lang="scss">
// Make global styles available
@import '@/scss/_global';
</style>

<style lang="scss" scoped>
#main-view {
  height: 100%;
  width: 100%;
}
</style>
