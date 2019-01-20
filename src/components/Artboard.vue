<template>
  <div
    class="artboard"
    v-bind:style="{ height: this.height+'px', width: this.width+'px' }"
    v-bind:class="{ 'is-selected': state.isSelected }"
    @click="state.isSelected = !state.isSelected"
  >
    <div class="artboard__top">
      <div>
        <span class="title">{{ this.title }}</span>
        <span class="dimension">{{ this.width }} x {{ this.height }}</span>
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
      <webview ref="iframe" class="iframe"></webview>
      <div class="artboard__handles">
        <div @mousedown="triggerResize" class="handle__bottom"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Artboard",

  props: {
    id: Number,
    title: String,
    height: Number,
    width: Number
  },

  data() {
    return {
      state: {
        isSelected: false,
        isLoading: false
      }
    };
  },

  computed: {
    // Bind to our Vuex Store's URL value
    url() {
      return this.$store.state.site.url;
    }
  },

  watch: {
    "state.isSelected": {
      // Toggle iFrame pointer-events based on the isSelected artboard state
      handler: function() {
        const element = this.$refs.iframe;
        if (this.state.isSelected == true) {
          element.style.pointerEvents = "auto";
          // document.addEventListener("keyup", this.keyHandler);
        } else if (this.state.isSelected == false) {
          element.style.pointerEvents = "none";
          // document.removeEventListener("keyup", this.keyHandler);
        }
      }
    },
    url: {
      // When the URL is changed, do this:
      handler: function() {
        this.loadSite();
      }
    }
  },

  mounted() {
    this.$nextTick(() => {
      // Load the <webview> the initial time
      this.loadSite();
    });
  },

  methods: {
    loadSite() {
      const _this = this;
      const frame = this.$refs.iframe;

      // When loading of webview starts
      function loadstart() {
        _this.state.isLoading = true; // Show loading spinner
      }

      // Once webview content is loaded
      function contentload() {
        // The following will be injected in the webview
        const execCode = `
            var data = {
              title: document.title,
              favicon:
                "https://www.google.com/s2/favicons?domain=" +
                window.location.href
            }

            function respond(event) {
              event.source.postMessage(data, '*');
            }

            window.addEventListener("message", respond);
        `;

        frame.executeScript({
          code: execCode
        });

        frame.contentWindow.postMessage("Send me your data!", "*"); // Send a request to the webview
      }

      function receiveHandshake(event) {
        // Data is accessible as event.data.*
        // Refer to the object that's injected during contentload()
        // for all keys
        const title = event.data.title;
        const favicon = event.data.favicon;

        _this.$store.commit("changeSiteData", {
          title: title,
          favicon: favicon
        });

        window.removeEventListener("message", receiveHandshake);
      }

      // Loading has finished
      function loadstop() {
        _this.state.isLoading = false; // Hide loading spinner
        removeListeners();
      }

      function loadabort() {
        new Notification("Aborted", {
          body: "The site stopped loading for some reason."
        });
      }

      // Bind events
      function addListeners() {
        frame.addEventListener("loadstart", loadstart);
        frame.addEventListener("contentload", contentload);
        frame.addEventListener("loadstop", loadstop);
        frame.addEventListener("loadabort", loadabort);
        window.addEventListener("message", receiveHandshake, false); // Listen for response
      }

      // Remove all event listeners
      function removeListeners() {
        frame.removeEventListener("loadstart", loadstart);
        frame.removeEventListener("contentload", contentload);
        frame.removeEventListener("loadstop", loadstop);
        frame.removeEventListener("loadabort", loadabort);
      }

      // Initialize the event listeners
      addListeners();

      // Set the URL
      frame.setAttribute('src', this.url)
    },

    // Limits the size of an artboard
    validateArtboardSizeInput(name, value) {
      // @TODO: Refactor this into the size editor
      const minSize = 50;
      const maxSize = 9999;

      // Make sure we're working with a number
      const newValue = typeof value == Number ? value : Number(parseInt(value));

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
        // eslint-disable-next-line
        // console.log(newValue);
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
      let parent = e.currentTarget.parentNode.parentNode.parentNode,
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
      document.documentElement.addEventListener("mousemove", doDrag, false);
      document.documentElement.addEventListener("mouseup", stopDrag, false);

      // Pause the panzoom
      if (document.$panzoom.state.isEnabled === true) {
        document.$panzoom.pause(); // TODO: Cleaner solution that polluting document?
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

          // Ignore pointer events on iframes
          let iframes = document.getElementsByClassName("iframe");

          for (let iframe of iframes) {
            iframe.style.pointerEvents = "none";
          }

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
          "mousemove",
          doDrag,
          false
        );
        document.documentElement.removeEventListener(
          "mouseup",
          stopDrag,
          false
        );

        // Re-enable pointer events on iframes
        let iframes = document.getElementsByClassName("iframe");

        for (let iframe of iframes) {
          iframe.style.pointerEvents = "auto";
        }

        // Re-enable the panzoom
        document.$panzoom.resume(); // TODO: Cleaner solution that polluting document?
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../scss/_variables";
$artboard-handle-height: 1rem;

.artboard {
  padding: 1rem;
  padding-right: 1.5rem;
  padding-bottom: $artboard-handle-height * 3;
  border: 1px solid transparent;
  position: relative;
  display: block;
  flex: 1 0 auto;
  height: 1200px;
  width: 300px;
  margin: 0 3.5rem;

  &:first-child {
    margin-left: 3.5rem;
  }

  &:first-child {
    margin-right: 3.5rem;
  }

  &:hover {
    background: #e6e6e6;
    border-radius: 6px;
    cursor: pointer;
  }

  &.is-selected {
    background: rgba(165, 197, 247, 0.1);
    border: 1px solid #a5c5f7;
    border-radius: 8px;
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
    box-shadow: 0 4px 10px rgba(#000, 0.1);

    iframe {
      height: 100%;
      width: 100%;
      pointer-events: none;
    }
  }

  .artboard__handles {
    position: absolute;
    bottom: 0;
    right: 0;

    .handle__right,
    .handle__bottom {
      background: $accent-color;
      content: "";
      height: $artboard-handle-height;
      width: $artboard-handle-height;
      position: absolute;
      border-radius: 100%;
      z-index: 1;
      border: 3px solid transparent;
    }

    .handle__bottom {
      bottom: calc(-#{$artboard-handle-height} - 16px);
      right: calc(-#{$artboard-handle-height} - 16px);

      &:hover {
        cursor: nwse-resize;
      }

      &:active {
        cursor: nwse-resize;
        z-index: 1;
        background: none;
        border-color: $accent-color;
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
