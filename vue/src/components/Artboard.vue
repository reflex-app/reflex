<template>
  <div class="artboard" v-bind:style="{height:artboard.height+'px', width:artboard.width+'px'}">
      <div class="artboard__top">
          <div>
              W: <input type="text" class="artboard__width" v-model="artboard.width" auto-complete="off"/>
              H: <input type="text" class="artboard__height" v-model="artboard.height" auto-complete="off"/>
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
            v-on:updateURL="render"
            nwfaketop 
            frameborder="0">
          </iframe>
          <div class="artboard__handles">
              <!-- <div class="handle__bottom"></div> -->
          </div>
      </div>
      <NewArtboardButton @add="$emit('add')"/>
  </div>
</template>

<script>
import NewArtboardButton from "./NewArtboardButton";

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
      }
    };
  },
  computed: {
    // Bind to our Vuex Store's URL value
    url() {
      return this.$store.state.url;
    }
  },
  methods: {
    render(url) {
      this.iframe.src = url;
    }
    // TODO: Watch for changes to artboard {}, save them to localstorage
    // TODO: + artboard function
    // TODO: - artboard function
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
  }

  &.is-selected {
    background: #2a2a2a;
    border: 1px solid #606060;
    border-radius: 6px;
  }

  &__top {
    width: 100%;
    display: flex;
    justify-content: space-between;
    color: #b3b3b3;
    margin-bottom: 0.5rem;

    & > *:not(:first-child) {
      margin-left: 16px;
    }
  }

  &__delete-button {
    position: relative;
    float: right;
    vertical-align: middle;
    margin-right: 0;
    color: white;
    opacity: 0.6;
    background: rgb(199, 25, 25);

    &:hover {
      opacity: 1;
      color: white;
      background: lighten(rgb(199, 25, 25), 10%);
    }
  }

  &__keypoints {
  }

  &__content {
    width: 100%;
    height: 100%;
    position: relative;
    border: 1px solid white;
    box-sizing: border-box;
    background: #ffffff;
    box-shadow: 0 4px 10px rgba(#000, 0.1);

    webview,
    iframe {
      height: 100%;
      width: 100%;
    }
  }

  &__handles {
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
