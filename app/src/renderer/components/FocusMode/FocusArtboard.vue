<template>
  <div id="artboards">
    <Artboard
      ref="artboard"
      v-bind="focusModeActiveScreen"
      :selected-items="selectedArtboards"
      class="artboard"
      :class="{ 'disco-mode': discoMode }"
      @resize="resize"
    />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import SelectionArea from '@simonwep/selection-js'
import Artboard from '@/components/Screens/Artboard'

export default {
  name: 'Artboards',
  components: {
    Artboard,
  },
  data() {
    return {
      selectionInstance: null,
      discoModeInterval: null,
    }
  },
  computed: {
    ...mapState({
      artboards: (state) => state.artboards.list,
      selectedArtboards: (state) => state.selectedArtboards,
      focusModeScreens: (state) => state.focusMode.screens,
      focusModeActiveScreen: (state) => state.focusMode.activeScreen,
      discoMode: (state) => state.gui.discoMode,
    }),
    ...mapGetters('interactions', ['isInteracting']),
  },
  watch: {
    /**
     * Watch the VueX discoMode Store
     */
    discoMode(newValue, oldValue) {
      if (newValue === true) {
        this.startDisco()
      } else {
        this.stopDisco()
      }
    },
  },
  mounted() {
    // Start automatically if saved in localStorage
    if (this.discoMode === true) this.startDisco()

    this.selectionInstance = new SelectionArea({
      class: 'selection-area', // Class for the selection-area
      selectedClass: 'is-selected',
      selectables: ['#artboards > .artboard'], // All elements in this container can be selected
      boundaries: ['#canvas'], // The boundary
      singleClick: true, // Enable single-click selection
    })

    this.selectionInstance
      .on('beforestart', (evt) => {
        // Prevent selections if the user is interacting with an artboard
        if (this.isInteracting) return false
      })
      .on('start', (evt) => {
        // Every non-ctrlKey causes a selection reset
        if (!evt.ctrlKey) {
          this.$store.dispatch('selectedArtboards/selectedArtboardsEmpty')
        }

        // Update state
        this.$store.commit('interactions/interactionSetState', {
          key: 'isSelectingArea',
          value: true,
        })
      })
      .on(
        'move',
        ({
          store: {
            changed: { removed, added },
          },
        }) => {
          /**
           * Only add / remove selected class to increase selection performance.
           */

          // Add
          added.forEach((item) => {
            const id = item.getAttribute('artboard-id')
            this.$store.dispatch('selectedArtboards/selectedArtboardsAdd', id)
          })

          // Remove
          removed.forEach((item) => {
            const id = item.getAttribute('artboard-id')
            this.$store.dispatch(
              'selectedArtboards/selectedArtboardsRemove',
              id
            )
          })
        }
      )
      .on('stop', ({ store: { selected } }) => {
        /**
         * Every element has a artboard-id property which is used
         * to find the selected nodes. Find these and append they
         * to the current selection.
         */
        // Remove all in case temporarily added
        this.$store.dispatch('selectedArtboards/selectedArtboardsEmpty')

        // Update state
        this.$store.commit('interactions/interactionSetState', {
          key: 'isSelectingArea',
          value: false,
        })

        // Push the new IDs
        selected.forEach((item) => {
          const id = item.getAttribute('artboard-id')
          this.$store.dispatch('selectedArtboards/selectedArtboardsAdd', id) // Add these items to the Store
        })
      })
  },
  beforeDestroy() {
    this.selectionInstance.destroy()
  },
  methods: {
    resize(artboard) {
      this.$store.commit('focusMode/focusResizeArtboard', artboard)
    },
    startDisco() {
      /**
       * getRandomInt(min, max)
       * https://stackoverflow.com/a/1527820/1114901
       */
      const getRandomInt = (min, max) => {
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min + 1)) + min
      }

      const setRandomSize = () => {
        this.$store.commit('focusMode/focusSetRandomSize', {
          width: getRandomInt(200, 1920),
          height: getRandomInt(200, 1080),
        })
      }

      // Immediately set a new size
      setRandomSize()

      // Set up the timer
      this.discoModeInterval = setInterval(() => {
        setRandomSize()
      }, 3000)

      console.log('disco start')
    },
    stopDisco() {
      clearInterval(this.discoModeInterval)
      this.discoModeInterval = null
      console.log('disco stop')
    },
  },
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

// Transition the changes to the height and width
// of the artboard when disco mode is active
.artboard.disco-mode {
  transition: width ease-in-out 500ms, height ease-in-out 500ms;
}
</style>
