<template>
  <div
    v-if="artboards.length"
    id="artboards"
    @contextmenu="rightClickMenu($event)"
  >
    <Artboard
      v-for="artboard in artboards"
      :key="artboard.id"
      ref="artboard"
      v-bind="artboard"
      @resize="resize"
    />
  </div>
  <!-- Show empty state if no artboards exist -->
  <div
    v-else
    class="empty-state"
  >
    <img
      src="@/assets/ftu-vector.svg"
      class="empty-state__image"
      alt="Welcome graphic"
    >
    <span class="empty-state__title">
      Welcome to {{ appName }}
    </span>
    <p class="empty-state__body">
      You can create new screens in the Screens panel on the left.
    </p>
  </div>
</template>

<script>
import Artboard from './Artboard'

import { remote } from 'electron'
const { Menu, MenuItem } = remote

export default {
  name: 'Artboards',
  components: {
    Artboard
  },
  computed: {
    artboards() {
      // Returns an array of artboards
      return this.$store.state.artboards
    },
    appName() {
      // Return the name of the Electron app
      // From package.json (name or productName)
      return remote.app.getName()
    }
  },
  watch: {
    artboards: function() {
      document.$panzoom.center()
    }
  },
  methods: {
    resize(artboard) {
      this.$store.commit('resizeArtboard', artboard)
    },
    rightClickMenu(e) {
      const element = e.target.querySelector('.frame')

      // Only display menu if a <webview> was found near the click
      if (element) {
        const menu = new Menu()
        menu.append(
          new MenuItem({
            label: 'Open Inspector',
            click() {
              console.log(element)
              element.openDevTools()
            }
          })
        )

        menu.popup(remote.getCurrentWindow())
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#artboards {
  position: relative;
  display: inline-flex;
  flex-direction: row;
  flex-wrap: nowrap;
  user-select: none;
  box-sizing: border-box;
  will-change: auto; // Activate GPU rendering
  z-index: 0;

  &.is-vertical {
    flex-direction: column;
    align-items: center;
  }
}

#sidebar {
  position: fixed;
  top: 100;
}

.empty-state {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;

  .empty-state__image {
    margin-bottom: 2rem;
  }

  .empty-state__title {
    font-size: 1.6rem;
  }

  .empty-state__body {
    line-height: 1.5;
    max-width: 250px;
  }
}
</style>
