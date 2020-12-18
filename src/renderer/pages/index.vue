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
import Panzoom from '@/components/panzoom/Panzoom.vue'
import SidePanel from '@/components/SidePanel'
import Screenshots from '@/components/Screenshot'
import Artboards from '@/components/Screens/Artboards'

export default {
  name: 'FocusView',
  components: {
    Artboards,
    SidePanel,
    Screenshots,
    Panzoom,
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
