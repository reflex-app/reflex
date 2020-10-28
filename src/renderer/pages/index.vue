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
import Artboards from '@/components/Screens/Artboards'
import SidePanel from '@/components/SidePanel'
import Screenshots from '@/components/Screenshot'
import Panzoom from '@/components/panzoom/Panzoom.vue'

export default {
  name: 'MainView',
  components: {
    Panzoom,
    FocusArtboard,
    SidePanel,
    Screenshots,
    Panzoom,
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
