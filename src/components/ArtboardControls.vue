<template>
  <div id="ArtboardControls">
    <div id="toolbar__canvas-controls">
      <div>
        <span id="canvas-controls__zoomOut" class="button" @click="zoomOut">-</span>
        <!-- <span id="canvas-controls__scale" v-if="panzoomInstance.transformMatrix">{{ panzoomInstance.transformMatrix[0] }}</span> -->
        <span id="canvas-controls__zoomIn" class="button" @click="zoomIn">+</span>
      </div>
      <!-- <a id="canvas-controls__fit-to-screen" @click="center">Center</a> -->
    </div>
    <!-- <div>
      <a id="canvas-controls__orientation" @click="toggleOrientation">Orientation</a>
    </div> -->
  </div>
</template>

<script>
export default {
  name: "ArtboardControls",
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
    panzoomInstance() {
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
      document.$panzoom.center();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../scss/_variables";

#ArtboardControls {
  z-index: 1;
  // padding: 0.5rem 1rem;
  color: #434343;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: none;
  position: absolute;
  bottom: 1.5rem;
  right: 1.25rem;

  // box-shadow: 0 6px 10px rgba(#000, 0.3);
  & > *:not(:first-child) {
    margin-left: 16px;
  }

  & > *:nth-child(1) {
    flex: 1 0 auto;
  }

  input[type="text"] {
    border: none;
    box-sizing: border-box;
    padding: 0.5rem;
    background: #FFFFFF;
    border: 1px solid #979797;
    border-radius: 4px;
    transition: all 0.125s ease-in-out;
    width: 200px;

    &:hover {
      background: lighten($body-bg, 5%);
    }

    &:focus {
      outline: none;
      background: lighten($body-bg, 3%);
      border: 1px solid rgba($accent-color, 1);
      width: 400px;
    }
  }

  #toolbar__canvas-controls {
    user-select: none;
    display: flex;
    flex-direction: column;
    align-items: center;

    #canvas-controls__zoomOut {
      margin-right: 0.5rem;
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
