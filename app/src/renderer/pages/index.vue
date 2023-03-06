<template>
  <div id="main-view">
    <ToolBar ref="toolbarElement" />
    <DevModeHud />
    <SidePanel />
    <Screenshots />
    <Panzoom>
      <!-- :style="{
        // height: `calc(100% - ${toolbarHeight}px)`,
        height: '100%',
        width: '100%',
      }" -->
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
import ToolBar from '~/components/ToolBar/index.vue'

const { init } = useEventHandler() // init event handling

const toolbarElement = ref() // Template Ref
const toolbarHeight = ref()

onMounted(() => {
  init() // initialize
  toolbarHeight.value = toolbarElement.value.$el.offsetHeight
})
</script>

<style lang="scss">
// Make global styles available
@import '@/scss/_global';
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
