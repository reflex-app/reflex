<template>
  <div ref="containerRef">
    <div v-if="artboards.list.length" id="artboards">
      <Artboard
        v-for="(artboard, index) in artboards.list"
        :key="artboard.id"
        ref="artboard"
        v-bind="artboard"
        :index="index"
        :artboard-id="artboard.id"
        :selected-items="selectedArtboards.list"
        :is-visible="artboard.isVisible"
        @resize="resize"
        :viewportObserver="data.viewportObserverParent"
      />
    </div>
    <!-- Show empty state if no artboards exist -->
    <WelcomeScreen v-else />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref, watch, computed } from 'vue'
import SelectionArea from '@viselect/vanilla'
import Artboard from './Artboard.vue'
import WelcomeScreen from './WelcomeScreen.vue'
import { useArtboardsStore } from '~/store/artboards'
import { useSelectedArtboardsStore } from '~/store/selectedArtboards'
import { useInteractionStore } from '~/store/interactions'
import { useEventListener } from '@vueuse/core'
import useEventHandler from '@/components/Screens/useEventHandler'

const { state: userEventsState } = useEventHandler() // init event handling

const artboards = useArtboardsStore()
const selectedArtboards = useSelectedArtboardsStore()
const interactions = useInteractionStore()

const data = reactive({
  selectionInstance: <SelectionArea | null>null, // TODO: Improve type
  viewportObserverParent: <IntersectionObserver | undefined>undefined,
  artboards: computed(() => artboards.list),
  selectedArtboards: computed(() => selectedArtboards.list),
  panzoomEnabled: computed(() => interactions.panzoomEnabled),
  isInteracting: computed(() => interactions.isInteracting),
  currentContext: computed(() => interactions.currentContext),
})

const containerRef = ref<HTMLElement | undefined>()

// Start observing the artboards in the viewport
startViewportObserver()

onMounted(() => {
  // ONLY ALLOW DRAG SELECT WHEN "CMD/CTRL" is held
  // Enable Panzoom when CMD is not pressed
  watch(
    userEventsState,
    (state) => {
      // These will run every time the state changes
      if (state.isCtrlPressed) {
        cmdHandler()
      }
    },
    { deep: true }
  )

  useEventListener(window, 'keyup', cmdHandler)

  createSelectionInstance()
})

// TODO Consider enabling this once panzoom is a Vue plugin?
// artboards: function() {
//   this.$nextTick(() => {
//     this.fitToScreen();
//   });
// }

onBeforeUnmount(() => {
  // Detach Select JS
  data.selectionInstance?.destroy()

  // Remove viewport observer
  stopViewportObserver()
})

function resize(artboard) {
  artboards.resizeArtboard(artboard)
}

function fitToScreen() {
  // TODO De-couple this call to the parent
  console.log('Artboards loaded', this.$parent)
  this.$parent.fitToScreen()
}

function createSelectionInstance() {
  data.selectionInstance = new SelectionArea({
    selectables: ['.artboard'], // All elements in this container can be selected
    startAreas: ['#canvas'], // Query selectors for elements from where a selection can be started from.
    boundaries: ['#canvas'], // Query selectors for elements which will be used as boundaries for the selection.
    container: '#canvas',
    // class: 'selection-area', // Class for the selection-area
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
      // Before allowing the user to drag-select things, run some checks
      if (data.panzoomEnabled) {
        console.log('panzoom status', data.panzoomEnabled)

        // Prevent selections if the user is interacting with an artboard
        console.log(evt)

        // Allow user to click or drag on an artboard even if panzoom is enabled
        if (evt?.type === 'mousedown') {
          return // Don't enable Selections
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
      if (userEventsState.isCtrlPressed === false) {
        selectedArtboards.empty()
      }

      // Update state
      interactions.interactionSetState({
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
          selectedArtboards.add(id)
        })

        // Remove
        removed.forEach((item) => {
          const id = item.getAttribute('artboard-id')
          selectedArtboards.remove(id)
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
      selectedArtboards.empty()

      // Update state
      interactions.interactionSetState({
        key: 'isSelectingArea',
        value: false,
      })

      // Push the new IDs
      selected.forEach((item) => {
        const id = item.getAttribute('artboard-id')
        selectedArtboards.add(id) // Add these items to the Store
      })

      // Re-enable panzoom
      interactions.setPanzoomState({
        value: true,
      })
    })
}

function enableSelections() {
  data.selectionInstance?.enable()
}

function disableSelections() {
  data.selectionInstance?.disable()
}

/**
 * Toggles the pan/zoom controls
 * When on, users can pan and zoom
 * When off, users can only interact s of Screens
 */
function cmdHandler() {
  // Disable panzoom when CMD/CTRL is pressed
  const canDragSelect = userEventsState.canDragSelect

  if (canDragSelect) {
    // Disable Panzoom
    interactions.setPanzoomState({
      value: false,
    })

    // Enable Selection
    enableSelections()
  } else {
    // Disable Selection
    disableSelections()

    // Enable Panzoom only if not drag-selecting
    interactions.setPanzoomState({
      value: true,
    })
  }
}

function startViewportObserver() {
  data.viewportObserverParent = new IntersectionObserver(onElementObserved, {
    root: containerRef.value,
    threshold: 1,
    rootMargin: '0px',
  })
}

function stopViewportObserver() {
  data.viewportObserverParent?.disconnect()
}

function onElementObserved(entries) {
  // Actions for each Observer instance
  entries.forEach((entry) => {
    if (entry.isIntersecting === false) {
      // If NOT in view, do this:
      artboards.changeArtboardViewportVisibility({
        id: entry.target.getAttribute('artboard-id'),
        isVisible: false,
      })
    } else {
      // Not in view, do this:
      artboards.changeArtboardViewportVisibility({
        id: entry.target.getAttribute('artboard-id'),
        isVisible: true,
      })
    }
  })
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
  gap: 10rem;
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
