<template>
  <div 
    class="artboard" 
    v-bind:style="{ height: artboard.height+'px', width: artboard.width+'px' }"
    v-bind:class="{ 'is-selected': state.isSelected }"
    @click="state.isSelected = !state.isSelected"
    >
      <div class="artboard__top">
          <div>
              W: 
              <input 
                type="text" 
                :value="artboard.width"
                @keyup.enter="validateArtboardSizeInput('width', $event.target.value)"
                class="artboard__width" 
                auto-complete="off"
              />
              H: 
              <input 
                type="text" 
                :value="artboard.height"
                @keyup.enter="validateArtboardSizeInput('height', $event.target.value)"
                class="artboard__height" 
                auto-complete="off"
              />
          </div>
          <div class="artboard__loader">
              <div class="content">
                  <div class="lds-ripple">
                      <div></div>
                      <div></div>
                  </div>
              </div>
          </div>
          <button class="button button--small artboard__delete-button" v-on:click="$emit('remove', artboard.id)">Delete</button>
      </div>
      <div class="artboard__keypoints"></div>
      <div class="artboard__content">
          <iframe 
            v-bind:src="url"
            ref="iframe"
            @updateURL="render"
            nwfaketop 
            frameborder="0"
            class="iframe"
            >
          </iframe>
          <div class="artboard__handles">
              <div 
                @mousedown="triggerResize"
                class="handle__bottom"
              />
          </div>
      </div>
      <NewArtboardButton @add="$emit('add')"/>
  </div>
</template>

<script>
import NewArtboardButton from "./NewArtboardButton";
import { panzoomInstance } from "../main.js";

export default {
  name: "Artboard",
  components: {
    NewArtboardButton
  },

  props: {
    height: Number,
    width: Number,
    id: Number
  },

  data() {
    return {
      artboard: {
        height: this.height,
        width: this.width,
        id: this.id
      },
      state: {
        isSelected: false
        // TODO: Add loading state
      }
    };
  },

  computed: {
    // Bind to our Vuex Store's URL value
    url() {
      return this.$store.state.url;
    }
  },

  watch: {
    // Watch for changes to the artboard object
    artboard: {
      handler: function() {
        // Trigger a localStorage update in the parent component
        this.$emit("resize", this.artboard);
      },
      deep: true
    },
    // Toggle iFrame pointer-events based on the isSelected artboard state
    "state.isSelected": {
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
    }
  },

  methods: {
    // TODO: Re-bind delete key to delete artboards
    // document.addEventListener("keyup", this.keyHandler);
    // document.removeEventListener("keyup", this.keyHandler);
    // Delete artboard if backspace/delete key is pressed
    // keyHandler(e) {
    //   let key = e.key || e.keyCode;

    //   if (key === "Backspace" || key === 8 || key === "Delete" || key === 46) {
    //     this.$emit("remove", this.artboard.id);

    //     // Remove the event listener
    //     document.removeEventListener("keyup", this.keyHandler);
    //   }
    // },

    // Limits the size of an artboard
    validateArtboardSizeInput(name, value) {
      const minSize = 50;
      const maxSize = 9999;

      // Make sure we're working with a number
      const _value = typeof value == Number ? value : Number(parseInt(value));

      // eslint-disable-next-line
      // console.log(_value);

      // Min & Max
      if (_value > maxSize || _value < minSize) {
        // Too small or big
        return false;
      } else {
        // Passed!
        // Update the size
        if (name == "height") {
          this.artboard.height = _value;
        } else if (name == "width") {
          this.artboard.width = _value;
        }
      }
    },

    // Render the website
    render(url) {
      this.iframe.src = url;
    },
    triggerResize(e) {
      // Inspired by http://jsfiddle.net/MissoulaLorenzo/gfn6ob3j/
      let _this = this;
      let parent = e.currentTarget.parentNode.parentNode.parentNode;

      let resizable = parent,
        startX,
        startY,
        startWidth,
        startHeight;

      // Trigger the start of a drag
      initDrag(e);

      function initDrag(e) {
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
      }

      function doDrag(e) {
        resizable.style.width = startWidth + e.clientX - startX + "px";
        resizable.style.height = startHeight + e.clientY - startY + "px";

        // Pause the panzoom
        panzoomInstance.pause();

        // Ignore pointer events on iframes
        let iframes = document.getElementsByClassName("iframe");
        for (let iframe of iframes) {
          iframe.style.pointerEvents = "none";
        }

        // Update the dimensions in the UI
        _this.artboard.height = parseInt(resizable.style.height, 10);
        _this.artboard.width = parseInt(resizable.style.width, 10);
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

        // Re-enable the panzoom
        panzoomInstance.resume();

        // Re-enable pointer events on iframes
        let iframes = document.getElementsByClassName("iframe");
        for (let iframe of iframes) {
          iframe.style.pointerEvents = "auto";
        }
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
    color: #b3b3b3;
    margin-bottom: 0.5rem;

    & > *:not(:first-child) {
      margin-left: 16px;
    }

    input[type="text"] {
      border: 0;
      outline: none;
      font-size: 1rem;
      background: none;
      width: 3rem;
      border-bottom: 1px solid darken($body-bg, 15%);
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
    position: absolute; // left: 50%;
    top: 0;
    left: 0;
    right: 0;
    display: none;
    // height: 100%;
    // width: 100%;
    // background: rgba($body-bg, 0.95);

    .content {
      left: 50%;
      // top: 50%;
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
