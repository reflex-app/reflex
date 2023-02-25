<template>
  <div
    class="panzoom-container"
    :class="{
      'dev-visual-debugger': showCanvasDebugger,
    }"
  >
    <PanzoomControls v-if="panzoomInstance" :instance="panzoomInstance" />
    <div
      ref="parent"
      id="canvas"
      :class="{
        'dev-visual-debugger': showCanvasDebugger,
      }"
    >
      <slot />
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
const parentRef = ref()
const domElement = ref()
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
  // Initialize
  // domElement.value = parentRef.value
  domElement.value = document.querySelector('#canvas')

  // TODO: This should be refactored after Vue 3 update
  const { $root } = getCurrentInstance()?.proxy
  if (!$root) console.warn('No Panzoom created')

  // Init Panzoom globally
  $root.$panzoom = Panzoom(domElement.value, {
    canvas: true, // Allows parent to control child
    cursor: 'grab',
    startScale: 1,
    startX: 0,
    // Scale to fit the content
    handleStartEvent: (event: Event) => {
      // Default actions
      // WARNING: Don't use preventDefault, as it will block other events

      // event.preventDefault()

      if (!panzoomEnabled)
        console.warn('Panzoom started although it should be disabled')

      // console.log('Panzooming logic')
      // if (!panzoomEnabled || userEventsState.canDragSelect) {
      //   // event.preventDefault() // default
      //   disablePanzoom()
      //   return false
      // } else {
      //   enablePanzoom()
      // }
      // console.log(panzoomEnabled, userEventsState.canDragSelect)
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
}
function disablePanzoom() {
  panzoomInstance.value?.setOptions({
    disablePan: true,
    disableZoom: true,
  })
}

function enableEventListeners() {
  const instance = panzoomInstance.value
  const element = domElement.value

  // element.addEventListener("panzoomchange", event => {
  //   console.log(event.detail); // => { x: 0, y: 0, scale: 1 }
  // });

  // Enable when CMD is not pressed
  // useEventListener(window, 'keydown', this.cmdHandler)
  // useEventListener(window, 'keyup', this.cmdHandler)

  // TODO Add tests for these

  // Handle mouse & touch events
  mouseHandlers(element, instance)

  // Mousewheel zoom w/ CMD/CTRL key
  wheelHandler(element, instance)

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
  DOMElement.parentElement.addEventListener('wheel', onWheel)

  function onWheel(event) {
    if (!panzoomEnabled) return false // Only do this if Panzoom is enabled

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
  const parentElement = DOMElement.parentElement

  // Emit start events
  const onEvents = ['mousedown', 'touchstart', 'gesturestart']
  onEvents.forEach((name) => {
    parentElement.addEventListener(name, startEvents)
  })

  const offEvents = ['mouseup', 'touchend', 'gestureend']
  offEvents.forEach((name) => {
    parentElement.removeEventListener(name, startEvents)
    parentElement.addEventListener(name, endEvents)
  })

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
    parentElement.removeEventListener(name, endEvents)
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
