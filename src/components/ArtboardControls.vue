<template>
  <div id="ArtboardControls" v-if="artboards.length">
    <div id="toolbar__canvas-controls">
      <span id="canvas-controls__zoomIn" class="button" @click="zoomIn">+</span>
      <span id="canvas-controls__zoomOut" class="button" @click="zoomOut">-</span>
      <!-- <span id="canvas-controls__scale" v-if="panzoomInstance.transformMatrix">{{ panzoomInstance.transformMatrix[0] }}</span> -->
      <!-- <a id="canvas-controls__fit-to-screen" @click="center">Center</a> -->
    </div>
    <!-- <div>
      <a id="canvas-controls__orientation" @click="toggleOrientation">Orientation</a>
    </div>-->
  </div>
</template>

<script>
import { platform } from "../utils";

export default {
  name: "ArtboardControls",
  computed: {
    artboards: function() {
      return this.$store.state.artboards;
    }
  },
  methods: {
    zoomIn() {
      document.$panzoom.zoomIn();
    },
    zoomOut() {
      document.$panzoom.zoomOut();
    },
    fitToScreen() {
      document.$panzoom.fitToScreen();
    }
  },
  mounted() {
    // Check native apps
    if (window.nw) {
      const vm = this;
      const nw = window.nw;
      const win = nw.Window.get();

      // Create menu container
      let Menu = new nw.Menu({
        type: "menubar"
      });

      if (platform.mac) {
        // Initialize default mac menu (App, Edit)
        Menu.createMacBuiltin(nw.App.manifest.name, { hideWindow: true });
      }

      // Setup View's child
      let viewSubMenu = new nw.Menu();
      viewSubMenu.append(
        new nw.MenuItem({
          label: "Zoom to Fit",
          click: function() {
            vm.fitToScreen();
          }
        })
      );

      // Add View
      Menu.append(
        new nw.MenuItem({
          label: "View",
          submenu: viewSubMenu
        })
      );

      // Append Menu to Window
      win.menu = Menu;
    }
  }
};
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
  bottom: 1.5rem;
  left: 1.25rem;

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
