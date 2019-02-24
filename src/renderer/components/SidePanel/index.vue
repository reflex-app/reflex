<template>
  <transition name="sidebar-transition">
    <div class="side-panel">
      <div class="side-panel__track">
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
        <div
          class="station"
          title="Screenshot"
          @click="setActive('Screenshot')"
        >
          <div
            class="station__button button"
            :class="{ 'button--is-active' : isActive('Screenshot') }"
          >
            <img
              src="@/assets/icons/screenshot.svg"
              alt="Screenshot"
            >
          </div>
          <span class="station__title">
            Screenshot
          </span>
        </div>
      </div>
      <div
        v-if="sidebar===true"
        class="side-panel__content"
      >
        <PanelComponent :title="activeStation" />
      </div>
    </div>
  </transition>
</template>

<script>
import PanelComponent from './PanelComponent.vue'

export default {
  name: 'SidePanel',
  components: {
    PanelComponent
  },
  data() {
    return {
      activeStation: 'Screens'
    }
  },
  computed: {
    // Bind to our Vuex Store's URL value
    artboards: function() {
      return this.$store.state.artboards
    },
    sidebar() {
      return this.$store.state.gui.sidebar
    }
  },

  methods: {
    setActive: function(val) {
      // Handle hide/show side panel
      if (this.sidebar && this.activeStation !== val) {
        // Normal State
        // Simply set the clicked station to active
        this.activeStation = val
      } else if (this.sidebar && this.activeStation === val) {
        // Close State
        // When clicking on the same station,
        // it should close the sidebar
        this.toggleSidebar(false)
        this.activeStation = ''
      } else if (this.sidebar === false) {
        // Closed State
        // Sidebar is closed, re-open
        this.toggleSidebar(true)
        this.activeStation = val
      }
    },
    isActive: function(val) {
      // Make sure to open the sidebar
      // if it was open in last session
      // Otherwise, don't set an active state
      if (this.sidebar === true) {
        return this.activeStation === val
      } else {
        return ''
      }
    },
    toggleSidebar() {
      this.$store.commit('toggleSidebar')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../scss/_variables";

.side-panel {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: 1fr;

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
</style>
