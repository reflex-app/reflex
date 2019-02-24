<template>
  <div id="screenshots">
    <div class="button button--secondary" @click="startScreenshot()" :class="{ 'button--is-active' : isScreenshotMode }">Screenshot</div>

    <div v-if="isScreenshotMode" class="modal modal-1">
      <div>
        <span>Click a screen to screenshot</span>
        <a href="#" @click="screenshotAll()">Screenshot All</a>
      </div>
      <div @click="stopScreenshot()" class="modal__close">Close</div>
    </div>
  </div>

  <!-- <div id="screenshot-panel">
    <div
      v-for="(artboard, index) in artboards"
      v-bind:key="index"
      class="screenshot-panel__artboard"
    >
      <div class="artboard-group">
        <div class="title">{{artboard.title}}</div>
        <div class="dimensions">{{artboard.width}} x {{artboard.height}}</div>
      </div>
      <div class="button button--secondary" @click="captureToClipboard(index)">Copy</div>
      <div class="button button--secondary" @click="capture(index, artboard.title)">Save</div>
    </div>
    <div class="button button--primary" @click="captureAll()">Save All</div>
  </div>-->
</template>

<script>
import * as capture from "./capture.js";

export default {
  name: "ScreenshotPanel",

  data() {
    return {
      isScreenshotMode: false
    };
  },

  computed: {
    // Bind to our Vuex Store's URL value
    artboards() {
      return this.$store.state.artboards;
    }
  },

  methods: {
    startScreenshot() {
      // Enable mode
      this.isScreenshotMode = !this.isScreenshotMode;
    },

    stopScreenshot() {
      // Disable mode
      this.isScreenshotMode = false;
    },

    screenshotAll() {
      capture.captureAll(this);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/scss/_variables";

#screenshots {
  .modal-1 {
    position: fixed;
    bottom: 2rem;
    margin: 0 auto;
    left: 0;
    right: 0;
  }
}

.modal {
  display: flex;
  justify-content: space-between;
  max-width: 500px;
  background: white;
  padding: 1rem;
  z-index: 100;
  background: #ffffff;
  border: 1px solid #c8c8c8;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.26);
  border-radius: 4px;

  .modal__close {
    color: black;
    cursor: pointer;
  }
}
</style>