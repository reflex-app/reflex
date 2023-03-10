<template>
  <div style="display: inline-block; width: 100%; height: 100%">
    <!-- We 'panzoom-exclude' to mark this as not relevant to Panzoom -->
    <!-- <PanzoomControls v-if="panzoomInstance" :instance="panzoomInstance" /> -->
    <div
      id="canvas"
      ref="outerPanArea"
      class="panzoom-container"
      :class="{
        'dev-visual-debugger': showCanvasDebugger,
      }"
    >
      <div
        ref="innerPanArea"
        :class="{
          'dev-visual-debugger': showCanvasDebugger,
        }"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance, onMounted, computed, watch } from 'vue'
import Panzoom, { PanzoomObject } from '@panzoom/panzoom'
import { ipcRenderer } from 'electron'
import isElectron from 'is-electron'
import PanzoomControls from './PanzoomControls.vue'
import { useInteractionStore } from '~/store/interactions'
import useEventHandler from '../Screens/useEventHandler'
import { useDevStore } from '~/store/dev'
// import { useEventListener } from '@vueuse/core'

const interactions = useInteractionStore()
const devStore = useDevStore()
const { state: userEventsState } = useEventHandler()

// Store
// const showCanvasDebugger = false // TODO: Migrate from Vuex -> Pinia
const showCanvasDebugger = devStore.showCanvasDebugger
const panzoomEnabled = computed(() => interactions.panzoomEnabled)
const isInteracting = computed(() => interactions.isInteracting)

// Template refs
const innerPanArea = ref()
const outerPanArea = ref() // The parent DOM Node
const panzoomInstance = ref<PanzoomObject | undefined>()

// Watch for changes and change Panzoom accordingly
watch(panzoomEnabled, (newVal) => {
  if (newVal === panzoomEnabled.value) return false

  if (panzoomEnabled) {
    console.log('Panzoom enabled')
    enablePanzoom()
  } else if (!panzoomEnabled) {
    console.log('Panzoom disabled')
    disablePanzoom()
  }
})

onMounted(async () => {
  // TODO: This should be refactored after Vue 3 update
  const { $root } = getCurrentInstance()?.proxy
  if (!$root) console.warn('No Panzoom created')

  // Init Panzoom globally
  // We use the 'canvas' option to enable interactions on the parent DOM Node as well
  // Docs: https://github.com/timmywil/panzoom#canvas
  $root.$panzoom = Panzoom(innerPanArea.value, {
    canvas: true, // Allows parent to control child
    cursor: 'grab',
    startScale: 1,
    startX: 0,
    handleStartEvent: (event: PointerEvent) => {
      // WARNING: Don't use preventDefault, as it will block other events
      // event.preventDefault()

      // This event (pointerdown/mousedown) can often fire _before_ other mousedown events!
      console.log('panzoom start event')

      // Check if user has CTRL/CMD key selected
      // If so, we can assume they don't want to Panzoom
      if (userEventsState.isCtrlPressed) {
        disablePanzoom()
        return false
      }

      if (!panzoomEnabled) {
        disablePanzoom()
      } else {
        enablePanzoom()
      }
    },
  })

  // Reference inside of this component
  panzoomInstance.value = $root.$panzoom

  // Center Panzoom
  // this.panzoomInstance.pan(
  //   origX + (current.clientX - startClientX) / scale,
  //   origY + (current.clientY - startClientY) / scale,
  //   {
  //     animate: false,
  //   }
  // )

  // Enable event listeners
  enableEventListeners()
})

function enablePanzoom() {
  panzoomInstance.value?.setOptions({
    disablePan: false,
    disableZoom: false,
  })

  interactions.setPanzoomState(true)

  interactions.interactionSetState({
    key: 'isPanzooming',
    value: true,
  })
}
function disablePanzoom() {
  console.log('panzoom disabled')
  panzoomInstance.value?.setOptions({
    disablePan: true,
    disableZoom: true,
  })

  interactions.setPanzoomState(false)

  interactions.interactionSetState({
    key: 'isPanzooming',
    value: false,
  })
}

function enableEventListeners() {
  const instance = panzoomInstance.value

  // element.addEventListener("panzoomchange", event => {
  //   console.log(event.detail); // => { x: 0, y: 0, scale: 1 }
  // });

  // TODO Add tests for these

  // IMPORTANT: We bind the listeners to the container

  // Handle mouse & touch events
  mouseHandlers(outerPanArea.value, instance)

  // Mousewheel zoom w/ CMD/CTRL key
  wheelHandler(outerPanArea.value, instance)

  // Listen for menu bar events
  if (isElectron()) {
    ipcRenderer.on('menu_zoom-in', () => instance?.zoomIn)
    ipcRenderer.on('menu_zoom-out', () => instance?.zoomOut)
    // ipcRenderer.on("menu_zoom-to-fit", this.panzoomInstance.fitToScreen);
    ipcRenderer.on('menu_show-developer-canvas-debugger', () => {
      devStore.toggleCanvasDebugger()
    })
  }
}

/**
 * Handles wheel events (i.e. mousewheel)
 * @param DOMElement DOM element that Panzoom is on
 * @param instance The Panzoom instance
 */
function wheelHandler(DOMElement, instance) {
  DOMElement.addEventListener('wheel', onWheel)

  function onWheel(event) {
    if (!panzoomEnabled) return false // Only do this if Panzoom is enabled

    console.log('panzoom wheel')

    // Prevent default scroll event
    event.preventDefault()

    // Require the CMD/CTRL key to be pressed
    // This prevents accidental scrolling
    if (event.ctrlKey || event.metaKey || event.altKey) {
      instance.zoomWithWheel(event)
    } else {
      // Allow trackpads to pan using two fingers
      const currentPan = instance.getPan()

      const newPan = {
        x: currentPan.x - event.deltaX,
        y: currentPan.y - event.deltaY,
      }

      instance.pan(newPan.x, newPan.y)
    }
  }
}

/**
 * Handles mouse and touch events
 * @param DOMElement DOM element that Panzoom is on
 * @param instance The Panzoom instance
 */
function mouseHandlers(DOMElement, instance) {
  // TODO These DO NOT WORK

  // Emit start events
  // const onEvents = ['mousedown', 'touchstart', 'gesturestart']
  // onEvents.forEach((name) => {
  //   DOMElement.addEventListener(name, startEvents)
  // })

  // const offEvents = ['mouseup', 'touchend', 'gestureend']
  // offEvents.forEach((name) => {
  //   DOMElement.removeEventListener(name, startEvents)
  //   DOMElement.addEventListener(name, endEvents)
  // })

  function startEvents(e) {
    // Only continue if Panzoom is enabled
    if (panzoomEnabled && userEventsState.canDragSelect === false) {
      panzoomInstance.value?.setOptions({
        cursor: 'grabbing',
      })

      // Update Store
      interactions.interactionSetState({
        key: 'isPanzooming',
        value: true,
      })
    } else {
      return false
    }
  }

  function endEvents(e) {
    panzoomInstance.value?.setOptions({
      cursor: 'grab',
    })

    // Update Store
    interactions.interactionSetState({
      key: 'isPanzooming',
      value: false,
    })

    // TODO: Remove event listener for just this one event name
    DOMElement.removeEventListener(name, endEvents)
  }
}

function fitToScreen() {
  // TODO Re-attach fitToScreen
  // this.panzoomInstance.fitToScreen();
}
</script>

<style lang="scss" scoped>
.panzoom-container {
  // position: absolute;
  // overflow: hidden;
  // outline: none;
  height: 100%;
  width: 100%;
  position: relative;
  // position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
}

#parent {
  height: auto;
  width: auto;
  position: relative;
  display: inline-flex;
  flex-direction: row;
  flex-wrap: nowrap;
  user-select: none;
}

#child {
  height: 100%;
  width: 100%;
}

.dev-visual-debugger {
  &:before,
  &:after {
    position: absolute;
    height: 100%;
    width: 100%;
    content: '';
    z-index: 1;
    pointer-events: none;
  }

  // Vertical line
  &:before {
    left: 50%;
    border-left: 1px solid red;
  }

  // Horizonal line
  &:after {
    top: 50%;
    left: 0;
    border-top: 1px solid red;
  }

  // Nested debugger
  .dev-visual-debugger {
    // Vertical line
    &:before {
      left: 50%;
      border-left: 1px solid green;
    }

    // Horizonal line
    &:after {
      top: 50%;
      border-top: 1px solid green;
    }
  }
}
</style>
