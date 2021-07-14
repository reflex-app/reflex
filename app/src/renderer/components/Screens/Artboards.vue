<template>
  <div>
    <div v-if="artboards.length" id="artboards">
      <Artboard
        v-for="(artboard, index) in artboards"
        :key="artboard.id"
        ref="artboard"
        v-bind="artboard"
        :index="index"
        :artboard-id="artboard.id"
        :selected-items="selectedArtboards"
        :is-visible="artboard.isVisible"
        @resize="resize"
      />
    </div>
    <!-- Show empty state if no artboards exist -->
    <WelcomeScreen v-else />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import SelectionArea from '@viselect/vanilla'
import Artboard from './Artboard'
import WelcomeScreen from './WelcomeScreen'
import { useEventListener } from '@vueuse/core'

export default {
  name: 'Artboards',
  components: {
    Artboard,
    WelcomeScreen,
  },
  data() {
    return {
      selectionInstance: {},
    }
  },
  computed: {
    ...mapState({
      artboards: (state) => state.artboards.list,
      selectedArtboards: (state) => state.selectedArtboards,
      panzoomEnabled: (state) => state.interactions.panzoomEnabled,
    }),
    ...mapGetters('interactions', ['isInteracting', 'currentContext']),
  },
  watch: {
    // TODO Consider enabling this once panzoom is a Vue plugin?
    // artboards: function() {
    //   this.$nextTick(() => {
    //     this.fitToScreen();
    //   });
    // }
  },
  mounted() {
    // TODO Create shortcut listener
    // this._keyListener = function (e) {
    //   if (e.ctrlKey || e.metaKey) {
    //     e.preventDefault() // prevent normal event from happening
    //     this.selectionInstance.enable() // enable selections
    //   } else {
    //     this.selectionInstance.disable()
    //   }
    // }

    // ONLY ALLOW DRAG SELECT WHEN "CMD/CTRL" is held
    // Enable when CMD is not pressed
    useEventListener(window, 'keydown', this.cmdHandler)
    useEventListener(window, 'keyup', this.cmdHandler)

    this.selectionInstance = new SelectionArea({
      selectables: ['.artboard'], // All elements in this container can be selected
      boundaries: ['#canvas'], // The boundary
      // startareas: ['#canvas'],
      class: 'selection-area', // Class for the selection-area
      selectedClass: 'is-selected',
      // singleClick: true, // Enable single-click selection
      singleTap: {
        allow: true,
      },
    })
      .on('beforestart', ({ event: evt, store }) => {
        if (this.panzoomEnabled === true) {
          // Prevent selections if the user is interacting with an artboard
          console.log(evt)

          // Allow user to click or drag on an artboard even if panzoom is enabled
          if (evt.type === 'mousedown') {
            // Continue
          } else {
            console.info(
              'Cannot interact with artboard while canvas is enabled. Please disable canvas.'
            )
            return false
          }
        }
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
      this.$store.commit('artboards/resizeArtboard', artboard)
    },
    fitToScreen() {
      // TODO De-couple this call to the parent
      console.log('Artboards loaded', this.$parent)
      this.$parent.fitToScreen()
    },
    /**
     * Toggles the pan/zoom controls
     * When on, users can pan and zoom
     * When off, users can only interact inside of Screens
     */
    cmdHandler(e) {
      // If user keeps holding the key down,
      // prevent firing repetitively and only counting once
      if (e.repeat) {
        return
      }

      // Only check for CMD/CTRL key to be held
      const isCtrlKeyPressed = e.ctrlKey ? true : false

      // Disable panzoom when CMD/CTRL is pressed
      const isDragSelectionEnabled = isCtrlKeyPressed ? true : false

      console.log(`Pressed ${isCtrlKeyPressed}`)

      // // Key down (pressed)
      // this.$store.commit('interactions/setPanzoomState', {
      //   value: isPanzoomEnabled,
      // })
    },
  },
}
</script>

<style lang="scss">
// WARNING: UNSCOPED!
.selection-area {
  border: 1px solid #cbcbcb;
  background: rgba(198, 198, 198, 0.3);
}
</style>

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
  // border: 2px solid green;

  &.is-vertical {
    flex-direction: column;
    align-items: center;
  }
}

.artboard {
  // border: 1px solid red;
}

#sidebar {
  position: fixed;
  top: 100;
}
</style>
