<template>
  <div id="screenshots">
    <!-- One selected -->
    <transition name="slide-fade">
    <div v-if="selectedArtboards.length > 0" class="modal">
      <div>
        <div class="button"
          @click="screenshotSelected()"
        >Save {{ selectedArtboards.length > 1 ? selectedArtboards.length + ' screens...' : selectedArtboards.length + ' screen...' }}</div>
        <div v-if="selectedArtboards.length===1" class="button" @click="copyToClipboard()">Copy to Clipboard</div>
      </div>
      <div @click="clearAllSelected()" class="modal__close button">Clear Selection</div>
    </div>
    </transition>

    <!-- TODO Show the file path in Finder -->
    <!-- <a href="#" @click="showInFinder()">Show in Finder</a> -->
  </div>
</template>

<script>
import * as capture from "./capture.js";
import { mapState } from "vuex";
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
    },
    ...mapState({
      selectedArtboards: state => state.selectedArtboards
    })
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

    clearAllSelected() {
      store.dispatch("selectedArtboardsEmpty");
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

    async copyToClipboard() {
      capture.copyToClipboard(this.selectedArtboards);
      // TODO Notify the user when the image has been saved to clipboard
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
  align-items: center;
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

/* Enter and leave animations can use different */
/* durations and timing functions.              */
.slide-fade-enter-active {
  transition: all 250ms ease;
}
.slide-fade-leave-active {
  transition: all 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateY(4rem);
  opacity: 0;
}
</style>