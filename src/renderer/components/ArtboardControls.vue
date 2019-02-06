<template>
  <div
    v-if="artboards.length"
    id="ArtboardControls"
  >
    <div id="toolbar__canvas-controls">
      <span
        id="canvas-controls__zoomOut"
        class="button"
        @click="zoomOut"
      >
        -
      </span>
      <span
        id="canvas-controls__zoomIn"
        class="button"
        @click="zoomIn"
      >
        +
      </span>
      <!-- <span id="canvas-controls__scale" v-if="panzoomInstance.transformMatrix">{{ panzoomInstance.transformMatrix[0] }}</span> -->
      <!-- <a id="canvas-controls__fit-to-screen" @click="center">Center</a> -->
    </div>
    <!-- <div>
      <a id="canvas-controls__orientation" @click="toggleOrientation">Orientation</a>
    </div>-->
  </div>
</template>

<script>
import { platform } from '../utils'
import { ipcRenderer } from 'electron'

export default {
  name: 'ArtboardControls',
  computed: {
    artboards: function () {
      return this.$store.state.artboards
    }
  },
  mounted () {
    // @TODO: Add tests for these
    ipcRenderer.on('menu_zoom-to-fit', () => {
      this.fitToScreen()
    })

    ipcRenderer.on('menu_zoom-in', () => {
      this.zoomIn()
    })

    ipcRenderer.on('menu_zoom-out', () => {
      this.zoomOut()
    })
  },
  methods: {
    zoomIn () {
      document.$panzoom.zoomIn()
    },
    zoomOut () {
      document.$panzoom.zoomOut()
    },
    fitToScreen () {
      document.$panzoom.fitToScreen()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../scss/_variables";

#ArtboardControls {
  z-index: 1;
  color: #434343;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: none;
  position: absolute;
  bottom: 1rem;
  right: 1rem;

  & > * {
    flex: 1 0 auto;
  }

  input[type="text"] {
    border: none;
    box-sizing: border-box;
    padding: 0.5rem;
    background: #ffffff;
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
    align-items: center;

    & > *:nth-child(1) {
      margin-right: 0.5rem;
    }

    #canvas-controls__fit-to-screen {
      margin-top: 0.25rem;
    }
  }

  a {
    text-decoration: none;
  }
}
</style>
