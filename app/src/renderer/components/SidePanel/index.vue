<template>
  <div class="side-panel">
    <!-- <div class="side-panel__track">
        <div
          class="station"
          title="Screens"
          @click="setActive('Screens')"
        >
          <div
            class="station__button button"
            :class="{ 'button--is-active' : isActive('Screens') }"
          >
            <img
              src="@/assets/icons/screens.svg"
              alt="Screens"
            >
          </div>
          <span class="station__title">
            Screens
          </span>
        </div>
    </div>-->
    <transition name="slide-in">
      <div v-if="data.sidebar === true" class="side-panel__content">
        <PanelComponent :title="data.activeStation" />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import PanelComponent from './PanelComponent.vue'
import { computed, reactive } from 'vue'
import { useArtboardsStore } from '~/store/artboards'
import { useGuiStore } from '~/store/gui'

const artboards = useArtboardsStore()
const gui = useGuiStore()

const data = reactive({
  activeStation: 'Screens',
  artboards: computed(() => artboards.list),
  sidebar: computed(() => gui.sidebar),
})

function setActive(val) {
  // Handle hide/show side panel
  if (data.sidebar && this.activeStation !== val) {
    // Normal State
    // Simply set the clicked station to active
    this.activeStation = val
  } else if (data.sidebar && this.activeStation === val) {
    // Close State
    // When clicking on the same station,
    // it should close the sidebar
    this.toggleSidebar(false)
    this.activeStation = ''
  } else if (data.sidebar === false) {
    // Closed State
    // Sidebar is closed, re-open
    this.toggleSidebar(true)
    this.activeStation = val
  }
}

function isActive(val) {
  // Make sure to open the sidebar
  // if it was open in last session
  // Otherwise, don't set an active state
  if (data.sidebar === true) {
    return this.activeStation === val
  } else {
    return ''
  }
}

function toggleSidebar() {
  gui.toggleSidebar()
}
</script>

<style lang="scss" scoped>
@import '../../scss/_variables';

.side-panel {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: 1fr;
  position: absolute;
  z-index: 100;
  min-height: calc(
    100vh - #{$gui-title-bar-height}
  ); // hard-coded height of toolbar

  .side-panel__track {
    position: relative;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(3, min-content);
    height: 100%;
    background: #ffffff;
    border-right: 1px solid $border-color;

    &.is-active {
      border: pink;
    }

    .station {
      margin: 0.5rem 0.75rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      &:first-child {
        margin-top: 1rem;
      }

      .station__button {
        // margin: 0.5rem 0.75rem;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.4rem;
        box-sizing: border-box;
        border-radius: 50%;
      }

      .station__title {
        color: #757575;
        margin-top: 0.25rem;
        font-size: 0.8rem;
      }
    }

    .side-panel__content {
      position: relative;
    }
  }
}

/* Enter and leave animations can use different */
/* durations and timing functions.              */
.slide-in-enter-active {
  transition: all 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.slide-in-leave-active {
  transition: all 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.slide-in-enter,
.slide-in-leave-to {
  transform: translateX(-20rem);
  background: red;
  // opacity: 0;
}
</style>
