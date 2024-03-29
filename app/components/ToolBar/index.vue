<template>
  <div
    id="toolbar"
    :class="{ 'is-fullscreen': state.isFullScreen, 'is-mac': state.isMac }"
  >
    <div class="flex gap-2">
      <Button
        role="ghost"
        icon="screens"
        :tight="true"
        :is-pressed="data.sidebar"
        title="Screens"
        @click="toggleSidebar"
      />
      <Button
        role="ghost"
        icon="star"
        :is-pressed="data.siteTreeEnabled"
        :tight="false"
        title="Site Tree"
        @click="toggleSiteTree()"
        data-testid="toggle-site-tree"
      />
    </div>
    <div class="draggable" @dblclick="toggleWindowMaximize" />
    <div v-if="data.artboards.length" id="toolbar__url-container">
      <HistoryControls />
      <div class="bar">
        <div
          class="bar__right"
          :class="{ 'is-active': state.inputStateActive }"
        >
          <div
            v-show="!state.inputStateActive"
            @click="state.inputStateActive = !state.inputStateActive"
          >
            <!-- <img v-if="favicon" :src="favicon" class="favicon" height="10" width="10"> -->
            <span class="title" :title="data.title || 'Page title'">{{
              data.title
            }}</span>
          </div>
          <URLInput
            class="input"
            :state="state.inputStateActive"
            @url-changed="changeURL"
            @toggle-input="state.inputStateActive = !state.inputStateActive"
          />
        </div>
      </div>
    </div>
    <div id="toolbar__recentURLs" />
    <!-- <div v-if="data.artboards.length" class="toolbar__right">
      <SwitchMode />
    </div> -->
    <!-- <UpdateChannel /> -->
    <div class="draggable" @dblclick="toggleWindowMaximize" />
    <div class="flex justify-end">
      <!-- <template v-if="isDev"> -->
        <PerfMonitor />
      <!-- </template> -->
      <InstallUpdateButton />
    </div>
  </div>
</template>

<script setup lang="ts">
import isElectron from 'is-electron'
import URLInput from '@/components/ToolBar/URLInput.vue'
import HistoryControls from '@/components/ToolBar/HistoryControls.vue'
import InstallUpdateButton from '@/components/ToolBar/InstallUpdateButton.vue'
// import SwitchMode from '@/components/ToolBar/SwitchMode.vue'

import UpdateChannel from '@/components/Settings/UpdateChannel.vue'
import Artboard from '@/components/Screens/Artboard.vue'

const runtimeConfig = useRuntimeConfig()
const isDev = runtimeConfig.public.DEV

// Pinia
import { useArtboardsStore } from '~/store/artboards'
import { useHistoryStore } from '~/store/history'
import { useGuiStore } from '~/store/gui'

// TODO: Re-connect with Electron
import * as remote from '@electron/remote'
import PerfMonitor from '../PerfMonitor.vue'

const artboards = useArtboardsStore()
const history = useHistoryStore()
const gui = useGuiStore()

const data = reactive({
  artboards: computed(() => artboards.list),
  title: computed(() => history.currentPage.title),
  url: computed(() => history.currentPage.url),
  favicon: computed(() => history.currentPage.favicon),
  sidebar: computed(() => gui.sidebar),
  siteTreeEnabled: computed(() => gui.siteTree),
})

const state = reactive({
  inputStateActive: false,
  isFullScreen: false,
  currentWindow: null,

  isMac() {
    return process.platform === 'darwin'
  },
})

function toggleSiteTree() {
  gui.toggleGui('siteTree')
}

onMounted(() => {
  if (isElectron()) {
    // Check if already in fullscreen
    toggleFullscreen()

    // Listen for fullscreen event
    const currentWindow = remote.getCurrentWindow()
    currentWindow.on('enter-full-screen', toggleFullscreen)
    currentWindow.on('leave-full-screen', toggleFullscreen)
  }
})

onBeforeUnmount(() => {
  // ! Required to avoid memory leaks
  const currentWindow = remote.getCurrentWindow()
  currentWindow.off('enter-full-screen', toggleFullscreen)
  currentWindow.off('leave-full-screen', toggleFullscreen)
})

function changeURL(url) {
  // Change the URL
  // TODO: Add debounce?
  console.log('should do stuff')

  history.changeSiteData({
    url,
  })

  // Add this new page to the history
  history.addPageToHistory(url)

  // Off
  state.inputStateActive = false
}

function toggleSidebar() {
  gui.toggleSidebar()
}

function toggleWindowMaximize() {
  const window = remote.getCurrentWindow()
  const isMaximized = window.isMaximized()
  // Do the opposite
  if (isMaximized) {
    window.unmaximize()
  } else {
    window.maximize()
  }
}

function toggleFullscreen() {
  // TODO Error about calling a window that has
  // already been closed
  // To avoid this problem, ensure you clean up any references to renderer callbacks passed to the main process.
  // This involves cleaning up event handlers, or ensuring the main process is explicitly told to dereference callbacks that came from a renderer process that is exiting.
  // See: https://electronjs.org/docs/api/remote#passing-callbacks-to-the-main-process
  // const window = remote.getCurrentWindow()
  // state.isFullScreen = !!window.isFullScreen()
}
</script>

<style lang="scss" scoped>
@import '@/scss/_variables.scss';

#toolbar {
  // TODO Refactor if supporting Windows in the future
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: $gui-title-bar-height;
  padding: 8px 0;
  padding-left: 1rem;
  z-index: 1;
  color: #434343;
  background: white;
  border-bottom: $gui-border;
  user-select: none;

  // Adjust position of sidebar button for Macs
  &.is-mac {
    padding-left: calc(65px + 1rem);
  }

  // Remove spacing reserved for traffic-sign on Mac
  &.is-fullscreen {
    & > *:first-child {
      margin-left: 1rem;
    }
  }

  .draggable {
    -webkit-app-region: drag; // Allow dragging
    // position: absolute;
    // z-index: -1;
    // width: 100%;
    width: auto;
    flex: 1;
    height: 100%;
    height: $gui-title-bar-height;
  }

  #toolbar__url-container {
    -webkit-app-region: no-drag; // Allow dragging
    position: relative;
    margin: 0 auto;
    display: flex;
    align-items: center;
    -webkit-app-region: no-drag !important; // Disable dragging

    @media screen and (max-width: 768px) {
      flex: 1 0 auto;
    }

    .bar {
      display: flex;
      align-items: center;
      min-width: 500px;
      border-radius: 40px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      user-select: none;
      display: flex;
      align-items: stretch;
    }

    .bar__left {
      position: relative;
      display: block;

      .sync {
        position: relative;
        display: inline-block;
        line-height: normal;
        vertical-align: baseline;
        height: 100%;
      }
    }

    .bar__right {
      display: flex;
      flex: 1;
      width: 100%;
      background: #eeeeee;
      transition: background 0.15s ease-out;
      padding: 0.2rem 1rem;

      &:hover {
        cursor: pointer;
        background: darken(#eeeeee, 10%);
      }

      &.is-active {
        padding: 0;
      }

      .title {
        font-weight: bold;
        display: block;
        margin-right: 0.5rem;
        max-width: 24rem;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .favicon {
        margin-right: 0.25rem;
      }
    }

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

  .toolbar__right {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
