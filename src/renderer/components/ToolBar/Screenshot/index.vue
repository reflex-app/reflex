<template>
  <div id="screenshots">
    <div
      class="button button--secondary"
      @click="startScreenshot()"
      :class="{ 'button--is-active' : isScreenshotMode }"
    >Screenshot</div>

    <div v-if="isScreenshotMode && currentModal===1" class="modal modal-1">
      <div>
        <span>Click on a screen to screenshot or</span>
        <a href="#" @click="screenshotAll()">Screenshot All</a>
      </div>
      <div @click="stopScreenshot()" class="modal__close">Close</div>
    </div>

    <div v-if="isScreenshotMode && currentModal===2" class="modal modal-2">
      <div>
        <a
          href="#"
          @click="screenshotSelected()"
        >Save {{ selectedArtboards.length > 1 ? selectedArtboards.length + ' screens...' : selectedArtboards.length + ' screen...' }}</a>
        <!-- only show copy to clipboard if one artboard is selected -->
        <a href="#" v-if="selectedArtboards.length===1" @click="copyToClipboard()">Copy to Clipboard</a>
      </div>
      <div @click="stopScreenshot()" class="modal__close">Close</div>
    </div>

    <div v-if="isScreenshotMode && currentModal===3" class="modal modal-3">
      <div>
        <span>Saved successfully.</span>
        <!-- @TODO: Show the file path in Finder -->
        <a href="#" @click="showInFinder()">Show in Finder</a>
      </div>
      <div @click="stopScreenshot()" class="modal__close">Close</div>
    </div>
  </div>
</template>

<script>
import * as capture from "./capture.js";
import store from "@/store";
import { shell } from "electron";

export default {
  name: "ScreenshotPanel",

  data() {
    return {
      isScreenshotMode: false,
      currentModal: 1,
      filePath: ""
    };
  },

  computed: {
    // Bind to our Vuex Store's URL value
    artboards() {
      return this.$store.state.artboards;
    },
    selectedArtboards() {
      return this.$store.state.selectedArtboards;
    }
  },

  methods: {
    startScreenshot() {
      const vm = this;

      // Enable mode
      this.isScreenshotMode = !this.isScreenshotMode;
      this.currentModal = 1;

      // Add event listener
      const el = document.getElementsByClassName("artboard");
      for (var i = 0; i < el.length; i++) {
        el[i].addEventListener("click", vm.artboardSelected);
      }

      // Show modal 2 if any artboards were already selected
      if (this.selectedArtboards.length > 0) {
        this.currentModal = 2;
      }
    },

    artboardSelected() {
      // Show modal 2
      this.currentModal = 2;

      // Watch for user to unselect all artboards...
      // if so, show the first modal again
      if (this.selectedArtboards.length < 1) {
        this.currentModal = 1;
      }
    },

    stopScreenshot() {
      // Disable mode
      this.isScreenshotMode = false;
      this.currentModal = 1;

      // Unbind all listeners
      const el = document.getElementsByClassName("artboard");
      for (var i = 0; i < el.length; i++) {
        el[i].removeEventListener("click", this.artboardSelected);
      }
    },

    async screenshotAll() {
      try {
        await capture.captureAll(this);

        // Show the success modal
        this.currentModal = 3;
      } catch (err) {
        throw new Error(err);
      }
    },

    async screenshotSelected() {
      try {
        await capture.captureMultiple(this.selectedArtboards);

        // Show the success modal
        this.currentModal = 3;
      } catch (err) {
        throw new Error(err);
      }
    },

    copyToClipboard() {
      const el = document.querySelectorAll(".artboard");

      // Find which index has '.is-selected'
      const id = () => {
        for (let i in el) {
          let counter = 0;
          if (el[i].classList.contains("is-selected") === false) {
            return false;
          } else {
            return counter;
          }
        }
      };

      capture.copyToClipboard(this.selectedArtboards);
    },

    showInFinder() {
      try {
        shell.showItemInFolder(this.filePath);
      } catch (err) {
        throw new Error(err);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/scss/_variables";

#screenshots {
  .modal {
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