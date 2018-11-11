<template>
  <div id="toolbar">
    <div id="toolbar__url-container">
      <input
        v-model="url"
        placeholder="Enter a website URL (http://website.com)"
        type="text"
        id="toolbar__url"
        name="toolbar__url" 
      />
      <div id="toolbar__recentURLs"></div>
    </div>
    <div id="toolbar__canvas-controls">
      <div>
        <span id="canvas-controls__zoomOut" @click="zoomOut">-</span>
        <span id="canvas-controls__scale" v-if="panzoom.transformMatrix">{{ panzoom.transformMatrix[0] }}</span>
        <span id="canvas-controls__zoomIn" @click="zoomIn">+</span>
      </div>
      <a href="#" id="canvas-controls__reset">Reset</a>
      <a href="#" id="canvas-controls__fit-to-screen">Fit</a>
    </div>
    <!-- <div>
      <a href="#" id="canvas-controls__orientation">Orientation</a>
    </div> -->
  </div>
</template>

<script>
export default {
  name: "Toolbar",
  computed: {
    // Bind to our Vuex Store's URL value
    url: {
      get() {
        return this.$store.state.url;
      },
      set(value) {
        this.$store.commit("changeURL", value);
      }
    },
    panzoom() {
      return this.$store.state.panzoom;
    }
  },
  methods: {
    zoomIn() {
      document.$panzoom.zoomIn();
    },
    zoomOut() {
      document.$panzoom.zoomOut();
    },
    center() {
      document.$panzoom._center();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../scss/_variables";

#toolbar {
  // height: 44px;
  z-index: 1;
  padding: 0.5rem 1rem;
  border-bottom: $gui-border;
  color: #434343;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(#fff, 0.95);

  // box-shadow: 0 6px 10px rgba(#000, 0.3);
  & > *:not(:first-child) {
    margin-left: 16px;
  }

  & > *:nth-child(1) {
    flex: 1 0 auto;

    input[type="text"] {
      width: 100%;
    }
  }

  input[type="text"] {
    border: none;
    background: #fff;
    border: 1px solid rgba(#ffffff, 0.25);
    border-radius: 4px;
    padding: 0.5rem;
    box-sizing: border-box;
    transition: all 0.125s ease-in-out;

    &:hover {
      background: lighten($body-bg, 5%);
    }

    &:focus {
      outline: none;
      background: lighten($body-bg, 3%);
      border: 1px solid rgba($accent-color, 1);
    }
  }

  #toolbar__canvas-controls {
    user-select: none;
    display: flex;
    flex-direction: column;
    align-items: center;

    #canvas-controls__zoomIn,
    #canvas-controls__zoomOut {
      color: #6f6f6f;
      padding: 0px 6px;
      box-sizing: border-box;
      cursor: pointer;
      border-radius: 2px;

      &:active {
        color: darken(#6f6f6f, 10%);
        background: gray;
      }
    }

    #canvas-controls__fit-to-screen {
      margin-top: 0.25rem;
    }
  }

  a {
    text-decoration: none;
  }

  #toolbar__url-container {
    position: relative;

    #toolbar__recentURLs {
      display: none;
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      width: 100%;
      background: white;
      box-shadow: 0 5px 20px rgba(#000, 0.2);
      transition: all 1s ease-in-out;
      border-radius: 4px;
      z-index: 1000;

      &.is-visible {
        display: block;
      }

      li {
        padding: 1rem;
        list-style: none;
        color: black;

        &:hover {
          cursor: pointer;
          background: rgba($accent-color, 0.1);
        }

        &.is-keyboard-selected {
          color: white;
          background: $accent-color;
        }
      }
    }
  }
}
</style>
