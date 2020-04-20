<template>
  <div id="focus-view">
    <div class="canvasContainer">
      <SidePanel />
      <SwitchButton
        :value="false"
        label="Fullscreen"
        @onToggle="toggleFullscreen"
      />
      <div>Toggle Fullscreen</div>
      <div v-if="fullScreenWebPage" class="focus-view__fullscreen-content">
        <WebPage :id="focusModeActiveScreen.id" :allow-interactions="true" />
      </div>
      <div v-else class="focus-view__content">
        <Screenshots />
        <SizeShifter />
        <Panzoom id="canvas">
          <FocusArtboard ref="artboards" />
        </Panzoom>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable vue/no-unused-components */

import { mapState } from 'vuex'
import Panzoom from '@/components/panzoom/Panzoom.vue'
import SidePanel from '@/components/SidePanel'
import Screenshots from '@/components/Screenshot'
import FocusArtboard from '@/components/FocusMode/FocusArtboard'
import SizeShifter from '@/components/FocusMode/SizeShifter'
import WebPage from '@/components/Screens/WebPage.vue'
import SwitchButton from '@/components/Shared/SwitchButton.vue'

export default {
  name: 'FocusView',
  components: {
    Panzoom,
    FocusArtboard,
    SizeShifter,
    SidePanel,
    Screenshots,
    WebPage,
    SwitchButton,
  },
  computed: {
    ...mapState({
      focusModeActiveScreen: (state) => state.focusMode.activeScreen,
      fullScreenWebPage: (state) => state.gui.fullScreenWebPage,
    }),
  },
  mounted() {
    this.panzoomInstance = this.$root.$panzoom
  },
  methods: {
    toggleFullscreen() {
      this.$store.commit('gui/toggleGui', 'fullScreenWebPage')
    },
  },
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

.frame {
  height: 100%;
  width: 100%;
}

.focus-view__fullscreen-content {
  width: 100%;
  height: 100%;
}

.focus-view__content {
  width: 100%;
  height: 100%;

  // #canvas {
  //   display: flex;
  //   position: absolute;
  //   // align-items: center;
  //   // justify-content: center;
  //   // width: 100%;
  //   // height: 100%;
  //   // top: 0;
  //   // left: 0;
  //   z-index: 0;
  // }
}
</style>
