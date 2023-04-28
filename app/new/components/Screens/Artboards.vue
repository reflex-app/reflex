<template>
  <div ref="containerRef">
    <div v-if="artboards.list.length" id="artboards">
      <ArtboardComponent v-for="(artboard, index) in artboards.list" ref="artboard" :key="artboard.id" v-bind="artboard"
        :index="index" :artboard-id="artboard.id" :selected-items="selectedArtboards.list"
        :is-visible="artboard.isVisible" :viewportObserver="data.viewportObserverParent" @clicked="onClick"
        @resize="resize" />
    </div>
    <!-- Show empty state if no artboards exist -->
    <WelcomeScreen v-else />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref, watch, computed } from 'vue'
import SelectionArea from '@viselect/vanilla'
import ArtboardComponent from './Artboard.vue'
import WelcomeScreen from './WelcomeScreen.vue'
import { Artboard, useArtboardsStore } from '~/store/artboards'
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
  // Initialize Selections
  createSelectionInstance()

  // Disable them until CTRL/CMD is pressed
  disableSelections()

  // Watch for user interaction changes
  watch(
    () => userEventsState.isCtrlPressed,
    (ctrlKeyPressed) => {
      // Only allow user to use Selections when CMD/CTRL is pressed
      if (ctrlKeyPressed) {
        enableSelections()
      } else {
        disableSelections()
      }
    }
  )
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
    container: '#canvas',
    boundaries: ['#canvas'], // Query selectors for elements which will be used as boundaries for the selection.
    startAreas: ['#canvas'], // Query selectors for elements from where a selection can be started from.
    selectables: ['.artboard'], // All elements in this container can be selected
    // class: 'selection-area', // Class for the selection-area
    // selectedClass: 'is-selected',
    behaviour: {
      // Specifies what should be done if already selected elements get selected again.
      overlap: 'keep', // invert: Invert selection for elements which were already selected
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
      console.log('Selection start event')

      if (userEventsState.canDragSelect) {
        return // Alow
      }

      if (data.panzoomEnabled) {
        // Allow user to click or drag on an artboard even if panzoom is enabled
        if (evt?.type === 'mousedown') {
          console.log('Clicked')

          return // Enable Selection for just that click
        } else {
          console.info(
            'Cannot interact with artboard while canvas is enabled. Please disable canvas.'
          )
          return false
        }
      }
    })
    .on('beforedrag', (evt) => {
      console.log('Selection drag event')
      return true
    })
    .on('start', (evt) => {
      if (data.panzoomEnabled) {
        console.warn('Panzoom is enabled!')
        disableSelections()
        return false
      }

      // Always reset selected when dragging
      selectedArtboards.empty()
      if (userEventsState.canDragSelect === true) {
      }

      console.log('selection')

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
      interactions.setPanzoomState(true)
    })
}

function enableSelections() {
  data.selectionInstance?.enable()
}

function disableSelections() {
  data.selectionInstance?.disable()
}

function onClick(id: Partial<Artboard>['id'], evt: MouseEvent) {
  if (evt.button !== 0) {
    // We only want left-click to select the artboard
    // We ignore middle-mouse (1) and right-click (2)
    return false
  }

  // User could be interacting with inner WebPage
  // We only want to check if this artboard is NOT yet selected
  // and if so, their intent was to enable it
  const isArtboardSelected = selectedArtboards.list.find((i) => i.id === id)

  if (!isArtboardSelected) {
    // Clear existing selected artboards
    selectedArtboards.empty()

    // Select this artboard
    selectedArtboards.add(id)
  }
}

// /**
//  * Toggles the pan/zoom controls
//  * When on, users can pan and zoom
//  * When off, users can only interact s of Screens
//  */
// function onCtrlPressed(pressed: boolean) {
//   // This will usually fire _before_ the canDragSelect event, since user
//   // hasn't fired mouseDown event yet
//   // So we'll setup a watcher until user lets go of CMD

//   // const canDragSelect = userEventsState.canDragSelect

//   // if (canDragSelect) {
//   //   enableSelections()
//   // } else {
//   //   disableSelections()
//   // }

//   if (pressed) {
//   } else {
//     watcher()
//   }
// }

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
    // Make sure artboard still exists
    // It could have been deleted and then this fires
    const artboardExists = artboards.list.find(
      (i) => i.id === entry.target.getAttribute('artboard-id')
    )
    if (!artboardExists) return false

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
