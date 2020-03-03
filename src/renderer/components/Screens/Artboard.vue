<template>
  <div
    v-show="isVisible"
    class="artboard"
    ref="artboard"
    :artboard-id="id"
    :style="{ minHeight: height+'px', minWidth: width+'px' }"
    :class="{ 'is-hover': isHover, 'is-selected': isSelected }"
    @click.right="rightClickHandler()"
  >
    <div class="artboard__top">
      <div>
        <span class="title">{{ title }}</span>
        <span class="dimension">{{ width }} x {{ height }}</span>
      </div>
      <!-- Show a loader when state.isLoading == true -->
      <div v-show="state.isLoading" class="artboard__loader is-loading">
        <div class="content">
          <div class="lds-ripple">
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
    <div class="artboard__keypoints"></div>
    <div class="artboard__content">
      <DeviceMockup :height="height" :width="width">
        <WebPage
          ref="frame"
          :id="id"
          :allowInteractions="canInteractWithArtboard"
          @loadstart="state.isLoading = true"
          @loadend="state.isLoading = false"
        />
      </DeviceMockup>
      <div class="artboard__handles">
        <div class="handle__bottom" @mousedown="triggerResize" title="Resize" />
      </div>
    </div>
  </div>
</template>

<script>
import { remote } from "electron";
const { Menu, MenuItem } = remote;
import isElectron from "is-electron";
import { mapState, mapGetters } from "vuex";
import rightClickMenu from "@/mixins/rightClickMenu.js";
import WebPage from "./WebPage.vue";
import DeviceMockup from "@/components/Mockups/deviceMockup.vue";

export default {
  name: "Artboard",
  components: {
    WebPage,
    DeviceMockup
  },
  props: {
    title: String,
    id: String,
    height: Number,
    width: Number,
    selectedItems: Array,
    isVisible: Boolean
  },
  data() {
    return {
      state: {
        isLoading: false
      }
    };
  },

  mounted() {
    this.$nextTick(() => {
      // Remove any leftover selected artboards
      // @TODO: This should be done from VueX Store, or wiped before quitting
      this.$store.dispatch("selectedArtboards/selectedArtboardsEmpty");
    });
  },

  computed: {
    ...mapState({
      url: state => state.history.currentPage.url,
      selectedArtboards: state => state.selectedArtboards,
      hoverArtboards: state => state.hoverArtboards
    }),
    ...mapGetters("interactions", ["isInteracting"]),
    isHover() {
      const isHover = this.hoverArtboards.filter(item => item == this.id);
      if (isHover.length) {
        return true;
      } else {
        return false;
      }
    },
    isSelected() {
      const isSelected = this.selectedArtboards.filter(item => item == this.id);
      if (isSelected.length) {
        return true;
      } else {
        return false;
      }
    },
    /**
     * Only allow interacting with the underlying
     * artboard (WebView) when the artboard is selected
     * and the user is not dragging a selection area
     */
    canInteractWithArtboard() {
      if (this.isSelected == false) return false; // Not selected!

      if (this.isSelected && this.isInteracting == false) {
        return true; // Can interact!
      }

      return false; // Otherwise, false
    }
  },

  methods: {
    rightClickHandler() {
      rightClickMenu(this.$store, {
        title: this.title,
        id: this.id,
        width: this.width,
        height: this.height,
        isVisible: this.isVisible
      });
    },
    // Limits the size of an artboard
    validateArtboardSizeInput(name, value) {
      // @TODO: Refactor this into the size editor
      const minSize = 50;
      const maxSize = 9999;

      // Make sure we're working with a number
      const newValue =
        typeof value === Number ? value : Number(parseInt(value));

      // Change the data based on the name
      let oldValue = "";
      if (name == "height") {
        oldValue = this.artboard.height;
      } else if (name == "width") {
        oldValue = this.artboard.width;
      }

      // If no change
      if (oldValue === newValue) {
        return;
      }

      // Min & Max
      if (newValue > maxSize || newValue < minSize) {
        return false;
      } else {
        // Size is within range!
        if (name == "height") {
          this.artboard.height = newValue;
        } else if (name == "width") {
          this.artboard.width = newValue;
        }
      }
    },
    triggerResize(e) {
      const vm = this;

      let parent = vm.$refs.artboard,
        resizable = parent,
        startX,
        startY,
        startWidth,
        startHeight;

      // Allow resizing, attach event handlers
      startX = e.clientX;
      startY = e.clientY;

      startWidth = parseInt(
        document.defaultView.getComputedStyle(resizable).width,
        10
      );
      startHeight = parseInt(
        document.defaultView.getComputedStyle(resizable).height,
        10
      );

      document.documentElement.addEventListener("mousedown", doStart);
      document.documentElement.addEventListener("mousemove", doDrag);
      document.documentElement.addEventListener("mouseup", stopDrag);

      // Pause the panzoom
      if (this.$root.$panzoom.state.isEnabled === true) {
        this.$root.$panzoom.disable(); // TODO: Cleaner solution that polluting document?
      }

      function doStart() {
        // Update global state
        vm.$store.commit("interactions/interactionSetState", {
          key: "isResizingArtboard",
          value: true
        });
      }

      // Resize objects
      let isDraggingTracker;
      function doDrag(e) {
        // This event needs to be debounced, as it's called on mousemove
        // Debounce via https://gomakethings.com/debouncing-your-javascript-events/
        if (isDraggingTracker) {
          window.cancelAnimationFrame(isDraggingTracker);
        }

        // Setup the new requestAnimationFrame()
        isDraggingTracker = window.requestAnimationFrame(function() {
          // Run our scroll functions
          resizable.style.width = startWidth + e.clientX - startX + "px";
          resizable.style.height = startHeight + e.clientY - startY + "px";

          // Ignore pointer events on frames
          let frames = document.getElementsByClassName("frame");

          // Update the dimensions in the UI
          vm.$emit("resize", {
            id: vm.id,
            width: parseInt(resizable.style.width, 10),
            height: parseInt(resizable.style.height, 10)
          });
        });
      }

      function stopDrag() {
        document.documentElement.removeEventListener(
          "mousedown",
          doStart,
          false
        );
        document.documentElement.removeEventListener(
          "mousemove",
          doDrag,
          false
        );
        document.documentElement.removeEventListener(
          "mouseup",
          stopDrag,
          false
        );

        // Re-enable pointer events on frames
        let frames = document.getElementsByClassName("frame");

        // Re-enable the panzoom
        vm.$root.$panzoom.enable(); // TODO: Cleaner solution that polluting document?

        // Update global state
        vm.$store.commit("interactions/interactionSetState", {
          key: "isResizingArtboard",
          value: false
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/scss/_variables";
$artboard-handle-height: 1rem;

.artboard {
  padding: 1rem;
  padding-right: 1.5rem;
  padding-bottom: $artboard-handle-height * 3;
  border: 3px solid transparent;
  position: relative;
  display: inline-block;
  // height: 1200px;
  // width: 300px;
  margin: 0 3.5rem;

  &:first-child {
    margin-left: 3.5rem;
  }

  &:first-child {
    margin-right: 3.5rem;
  }

  &:hover,
  &.is-hover {
    border-color: #929292;
    cursor: pointer;
  }

  &.is-selected {
    background: rgba(226, 239, 255, 0.63);
    border-color: #2f82ea;
  }

  .artboard__top {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;

    & > *:not(:first-child) {
      margin-left: 16px;
    }

    .title {
      color: black;
      margin-right: 1rem;
    }

    .dimension {
      color: #636363;
    }
  }

  .artboard__content {
    width: 100%;
    height: 100%;
    position: relative;
    border: 1px solid white;
    box-sizing: border-box;
    background: #ffffff;
    transition: all 100ms ease-out;
    // box-shadow: 0 4px 10px rgba(#000, 0.1);
  }

  .artboard__handles {
    position: absolute;
    bottom: 0;
    right: 0;

    .handle__bottom {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      left: 0;
      top: 0;
      bottom: calc(-#{$artboard-handle-height} - 16px);
      right: calc(-#{$artboard-handle-height} - 16px);
      padding: 40px;
      cursor: nwse-resize;

      &:hover:after {
        background: darken($accent-color, 20%);
      }

      &:active:after {
        cursor: nwse-resize;
        z-index: 1;
        background: none;
        border-color: $accent-color;
      }

      &:after {
        content: "";
        position: relative;
        background: $accent-color;
        height: $artboard-handle-height;
        width: $artboard-handle-height;
        position: absolute;
        border-radius: 100%;
        border: 3px solid transparent;
        z-index: 1;
      }
    }
  }

  & .artboard__loader {
    position: absolute;
    top: 0;
    right: 2rem;

    .content {
      left: 50%;
      transform: translateX(-50%);
      color: white;
      position: absolute;
    }

    &.is-loading {
      display: block;
    }

    .lds-ripple {
      display: inline-block;
      position: relative;
      width: 64px;
      height: 64px;
    }

    .lds-ripple div {
      position: absolute;
      border: 4px solid $accent-color;
      opacity: 1;
      border-radius: 50%;
      animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
    }

    .lds-ripple div:nth-child(2) {
      animation-delay: -0.5s;
    }

    @keyframes lds-ripple {
      0% {
        top: 20px;
        left: 20px;
        width: 0;
        height: 0;
        opacity: 1;
      }

      100% {
        top: -1px;
        left: -1px;
        width: 42px;
        height: 42px;
        opacity: 0;
      }
    }
  }
}
</style>
