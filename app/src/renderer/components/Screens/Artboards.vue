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
        :viewportObserver="viewportObserverParent"
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
// import { useEventListener } from '@vueuse/core'

export default {
  name: 'Artboards',
  components: {
    Artboard,
    WelcomeScreen,
  },
  data() {
    return {
      selectionInstance: null,
      viewportObserverParent: null,
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
  created() {
    // Start observing the artboards in the viewport
    this.startViewportObserver()
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
    // useEventListener(window, 'keydown', this.cmdHandler)
    // useEventListener(window, 'keyup', this.cmdHandler)
  },
  beforeDestroy() {
    // Detach Select JS
    this.selectionInstance?.destroy()

    // Remove viewport observer
    this.stopViewportObserver()
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
    enableSelections() {
      this.selectionInstance = new SelectionArea({
        startAreas: ['#canvas'], // Elements from where a selection can be started from.
        boundaries: ['#canvas'], // Elements which will be used as boundaries for the selection
        selectables: ['.artboard'], // All elements with this class can be selected
        selectionContainerClass: 'selection-area-container', // Query selectors for elements from where a selection can be started from.
        selectionAreaClass: 'selection-area', // Class for the selection-area itself (the element).
        // selectedClass: 'is-selected',
        behaviour: {
          // Specifies what should be done if already selected elements get selected again.
          overlap: 'invert', // invert: Invert selection for elements which were already selected
          // On which point an element should be selected.
          // Available modes are cover (cover the entire element), center (touch the center) or
          // the default mode is touch (just touching it).
          intersect: 'touch',
          // px, how many pixels the point should move before starting the selection (combined distance).
          // Or specifiy the threshold for each axis by passing an object like {x: <number>, y: <number>}.
          startThreshold: 10,
          // Scroll configuration.
          scrolling: {
            // On scrollable areas the number on px per frame is devided by this amount.
            // Default is 10 to provide a enjoyable scroll experience.
            speedDivider: 10,
            // Browsers handle mouse-wheel events differently, this number will be used as
            // numerator to calculate the mount of px while scrolling manually: manualScrollSpeed / scrollSpeedDivider.
            manualSpeed: 750,
            // This property defines the virtual inset margins from the borders of the container
            // component that, when crossed by the mouse/touch, trigger the scrolling. Useful for
            // fullscreen containers.
            startScrollMargins: { x: 0, y: 0 },
          },
        },
        features: {
          touch: true, // Enable / disable touch support.
          range: true, // Range selection.
          singleTap: {
            allow: true, // Enable single-click selection (Also disables range-selection via shift + ctrl).
            intersect: 'native', // 'native' (element was mouse-event target) or 'touch' (element visually touched).
          },
        },
      })
        .on('beforestart', ({ event: evt, store }) => {
          if (this.panzoomEnabled === true) {
            // Prevent selections if the user is interacting with an artboard
            console.log(evt)

            // Allow user to click or drag on an artboard even if panzoom is enabled
            if (evt.type === 'mousedown') {
              // Continue
              return
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

          // // Re-enable panzoom
          // this.$store.commit('interactions/setPanzoomState', {
          //   value: true,
          // })
        })
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
      const isCtrlKeyPressed = e.ctrlKey || e.metaKey ? true : false

      console.log('isCtrlKeyPressed', isCtrlKeyPressed)

      // Disable panzoom when CMD/CTRL is pressed
      const isDragSelectionEnabled = !isCtrlKeyPressed
      console.log('panzoom enabled?', isDragSelectionEnabled)

      // Key down (pressed)
      this.$store.commit('interactions/setPanzoomState', {
        value: isDragSelectionEnabled,
      })

      if (isDragSelectionEnabled) {
        this.enableSelections()
      } else {
        this.selectionInstance.destroy()
      }
    },
    startViewportObserver() {
      this.viewportObserverParent = new IntersectionObserver(
        this.onElementObserved,
        {
          root: this.$el,
          threshold: 1,
          rootMargin: '0px',
        }
      )
    },
    stopViewportObserver() {
      this.viewportObserverParent.disconnect()
    },
    onElementObserved(entries) {
      // Actions for each Observer instance
      entries.forEach((entry) => {
        if (entry.isIntersecting === false) {
          // If NOT in view, do this:
          this.$store.dispatch('artboards/changeArtboardViewportVisibility', {
            id: entry.target.getAttribute('artboard-id'),
            isVisible: false,
          })
        } else {
          // Not in view, do this:
          this.$store.dispatch('artboards/changeArtboardViewportVisibility', {
            id: entry.target.getAttribute('artboard-id'),
            isVisible: true,
          })
        }
      })
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
