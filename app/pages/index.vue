<template>
  <div id="main-view">
    <DevModeHud />
    <SidePanel />
    <SiteTree />
    <Screenshots />
    <Panzoom>
      <Artboards />
    </Panzoom>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Panzoom from '@/components/panzoom/Panzoom.vue'
import SidePanel from '@/components/SidePanel/index.vue'
import Screenshots from '@/components/Screenshot/index.vue'
import Artboards from '@/components/Screens/Artboards.vue'
import useEventHandler from '@/components/Screens/useEventHandler'
import DevModeHud from '~/components/DevModeHud.vue'
import SiteTree from '@/components/SiteTree/index.vue'

const { init } = useEventHandler() // init event handling

onMounted(() => {
  init() // initialize
})
</script>

<style lang="scss">
// Make global styles available
@import '@/scss/global.scss';
</style>

<style lang="scss" scoped>
@import '@/scss/_variables';

#main-view {
  background: $body-bg;
  position: relative;
  height: 100%;
  width: 100%;
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
