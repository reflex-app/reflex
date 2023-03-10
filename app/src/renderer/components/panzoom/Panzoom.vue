<template>
  <div style="display: inline-block; width: 100%; height: 100%">
    <!-- We 'panzoom-exclude' to mark this as not relevant to Panzoom -->
    <!-- <PanzoomControls v-if="panzoomInstance" :instance="panzoomInstance" /> -->
    <div class="dev">
      <div>Mouse: {{ mouse }}</div>
    </div>
    <div
      id="canvas"
      ref="outerPanArea"
      class="panzoom-container"
      :class="{
        'dev-visual-debugger': showCanvasDebugger,
      }"
    >
      <!-- For transform-origin: 50% 50% to work, this next element HAS to be display:block -->
      <div
        ref="innerPanArea"
        style="
          display: block;
          position: relative;
          /* height: 100%; */
          /* width: 100%; */
          overflow: visible;
        "
      >
        <!-- Now we have the real panzoom content inside: -->
        <div
          class="panzoom-inner"
          :class="{
            'dev-visual-debugger': showCanvasDebugger,
          }"
        >
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  getCurrentInstance,
  onMounted,
  computed,
  watch,
} from 'vue'
import Panzoom, { PanzoomObject } from '@panzoom/panzoom'
import { ipcRenderer } from 'electron'
import isElectron from 'is-electron'
import PanzoomControls from './PanzoomControls.vue'
import { useInteractionStore } from '~/store/interactions'
import useEventHandler from '../Screens/useEventHandler'
import { useDevStore } from '~/store/dev'
import { isEqual } from 'lodash'
import { initialPanZoom, getPanzoomElement, minScale } from './panzoomFns'
// import { useEventListener } from '@vueuse/core'

const interactions = useInteractionStore()
const devStore = useDevStore()
const { state: userEventsState } = useEventHandler()

// Store
const showCanvasDebugger = computed(() => devStore.showCanvasDebugger)
const panzoomEnabled = computed(() => interactions.panzoomEnabled)
const isInteracting = computed(() => interactions.isInteracting)

const mouse = reactive({
  x: 0,
  y: 0,
})

// Template refs
const innerPanArea = ref<HTMLElement>()
const outerPanArea = ref<HTMLElement>() // The parent DOM Node
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
  const { $root, $config } = getCurrentInstance()?.proxy
  if (!$root) console.warn('No Panzoom created')

  outerPanArea.value?.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX
    mouse.y = e.clientY
  })

  // const startZoom = initialZoom()
  const { x: startX } = initialPanZoom()
  const { y: startY } = initialPanZoom()
  const { zoom: startZoom } = initialPanZoom()

  // Init Panzoom globally
  // We use the 'canvas' option to enable interactions on the parent DOM Node as well
  // Docs: https://github.com/timmywil/panzoom#canvas
  if (!innerPanArea.value) {
    console.warn('No innerPanArea')
    return false
  }

  $root.$panzoom = Panzoom(innerPanArea.value, {
    canvas: true, // Allows parent to control child
    cursor: 'grab',
    // origin = transform-origin is the origin from which transforms are applied
    // Default: 50% 50% https://github.com/timmywil/panzoom#origin
    origin: '0 0',
    // origin: '0 0',
    minScale: minScale,
    startX: startX, // x
    startY: startY, // y
    startScale: startZoom,
    // Override the focal point of the zoom
    // because we don't use the default 50% 50% transform-origin
    // focal: {
    //   x: innerPanArea.value?.offsetLeft,
    //   y: innerPanArea.value?.offsetTop,
    // },
    // contain: false,
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

  // TODO: Remove later; useful for debugging
  const isDev = $config?.DEV
  if (isDev) {
    let zoom, pan
    setInterval(() => {
      const currZoom = panzoomInstance.value?.getScale()
      const currPan = panzoomInstance.value?.getPan()

      const isNewZoom = zoom !== currZoom
      const isNewPan = isEqual(pan, currPan) === false

      if (isNewZoom) zoom = currZoom
      if (isNewPan) pan = currPan

      if (isNewPan || isNewZoom) {
        console.log('Panzoom', { zoom, ...pan }, isNewZoom, isNewPan)
      }
    }, 1000)
  }

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
  if (!instance) {
    console.warn('No Panzoom instance')
    return false
  }

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
function wheelHandler(DOMElement, instance: PanzoomObject) {
  DOMElement.addEventListener('wheel', onWheel)

  function onWheel(event) {
    if (!panzoomEnabled) return false // Only do this if Panzoom is enabled

    console.log('panzoom wheel')

    // Prevent default scroll event
    event.preventDefault()

    // Normalize to deltaX in case shift modifier is used on Mac
    const delta =
      event.deltaY === 0 && event.deltaX ? event.deltaX : event.deltaY
    const wheel = delta < 0 ? 1 : -1

    // Require the CMD/CTRL key to be pressed
    // This prevents accidental scrolling
    if (event.ctrlKey || event.metaKey || event.altKey) {
      // If we were using transform-origin 50%,50% on the Panzoom class we could use instance.zoomWithWheel and be done with it
      // instance.zoomWithWheel(event)
      // But we are using origin 0,0 so we need to do this manually
      // Docs: https://github.com/timmywil/panzoom#zoomtopoint
      // https://github.com/timmywil/panzoom/issues/482#issuecomment-621933139
      // https://github.com/timmywil/panzoom/issues/630#issuecomment-1419893403
      // https://github.com/timmywil/panzoom/issues/564#issuecomment-832791748
      // https://github.com/timmywil/panzoom/issues/555
      // https://github.com/timmywil/panzoom/blob/7428761452cfb570a7ebf7e5d6d7cd18b1893ee2/src/panzoom.ts#L349

      function convertClientPointToPanzoomViewport() {
        // We receive a clientX and clientY from the event
        // We need to convert this to a point relative to the Panzoom viewport
        // This is because Panzoom uses the viewport as its origin
        // We can do this by using the Panzoom instance's getBoundingClientRect method
        const { el: viewport, rect: viewportRect } =
          getPanzoomElement('viewport')
        if (!viewport) return { x: 0, y: 0 }

        // We need to subtract the Panzoom viewport's offset from the event's X/Y
        // We calculate all the size outside the Panzoom Viewport and subtract it from the event's X/Y
        const rootElement = document.body
        const rootRect = rootElement.getBoundingClientRect()
        // rootRect.height = rootRect.height - viewportRect.height
        // rootRect.width = rootRect.width - viewportRect.width

        console.log(rootElement, viewport)

        console.log(rootRect.height, viewportRect.height)

        const x = event.clientX - (rootRect.width - viewportRect.width)
        const y = event.clientY - (rootRect.height - viewportRect.height)

        return { x, y }
      }

      // const scale = instance.getScale()
      // const toScale = scale * Math.exp(wheel / 3)
      // const toScale = scale * Math.exp(wheel / 30)

      // Calculate the new zoom level based on the wheel delta
      // const delta = event.deltaY || event.detail || event.wheelDelta
      // const delta =
      //   event.deltaY === 0 && event.deltaX ? event.deltaX : event.deltaY

      // const zoomDelta = delta ? delta / 10000 : 0 // TODO: Make the value smaller to zoom faster
      // const zoomLevel = panzoomInstance.value?.getScale() + zoomDelta

      // Calculate the center point of the viewport
      const { el: viewport, rect: viewportRect } = getPanzoomElement('viewport')
      const { el: container, rect: containerRect } =
        getPanzoomElement('container')
      if (!viewport || !container) return false

      ////////////////

      // Calculate the zoom scale
      const delta = Math.max(-1, Math.min(1, event.deltaY))
      // const zoomScale = Math.pow(1.2, delta)
      const prevScale = instance.getScale()
      let newScale = prevScale + delta / 100
      newScale = Math.max(newScale, minScale) // Ensure the scale never goes below 0.001

      // const deltaX =
      //   (event.clientX - container.offsetLeft) * (1 / prevScale - 1 / newScale)
      // const deltaY =
      //   (event.clientY - container.offsetTop) * (1 / prevScale - 1 / newScale)
      // const newX = instance.getPan().x - deltaX
      // const newY = instance.getPan().y - deltaY
      const currPan = {
        x: instance.getPan().x,
        y: instance.getPan().y,
      }

      // calculate the new pan position to keep the mouse centered
      const zoomFactor = newScale / prevScale
      const mouse = {
        x: event.clientX,
        y: event.clientY,
      }

      // const offset = {
      //   x: mouse.x - containerRect.left - currPan.x * prevScale,
      //   y: mouse.y - containerRect.top - currPan.y * prevScale,
      // }
      // const newPan = {
      //   x: currPan.x - offset.x * delta,
      //   y: currPan.y - offset.y * delta,
      // }

      // const offsetX = mouseOffset.x - viewport.offsetWidth / 2
      // const offsetY = mouseOffset.y - viewport.offsetHeight / 2
      // const panX =
      //   instance.getPan().x -
      //   offsetX * (newScale / prevScale - 1) +
      //   ((container.offsetWidth - viewport.offsetWidth) / 2) *
      //     (newScale / prevScale)
      // const panY = instance.getPan().y - offsetY * (newScale / prevScale - 1)

      // `focal` is a low-level option for focusing in on a point of the element,
      // not relative to the parent dimensions.
      // But zooming the way we usually think about it is often relative to parent dimensions
      // and not the element, which is why Panzoom has the zoomToPoint method to make things easier.
      // Setting the focal to the existing transform doesn't work, as those numbers aren't really related.
      // Original `focal` implementation: https://github.com/timmywil/panzoom/blob/7428761452cfb570a7ebf7e5d6d7cd18b1893ee2/src/panzoom.ts#LL401C5-L404C6
      // This assumes the transform-origin is 50%,50%
      // In our case, the transform-origin is 0,0
      // const focal = {
      //   x: (mouse.x / viewportRect.width) * (viewportRect.width * newScale),
      //   y: (mouse.y / viewportRect.height) * (viewportRect.height * newScale),
      // }

      ///////////////
      // const viewportCenter = {
      //   x: viewportRect.width / 2,
      //   y: viewportRect.height / 2,
      // }
      // const containerCenter = {
      //   x: containerRect.width / 2,
      //   y: containerRect.height / 2,
      // }
      // const focal = {
      //   x: (mouse.x / viewportCenter.x) * (containerCenter.x * newScale),
      //   y: (mouse.y / viewportCenter.y) * (containerCenter.y * newScale),
      // }
      ///////////////
      // const mouseOffset = {
      //   x: mouse.x - containerRect.left - containerRect.width / 2,
      //   y: mouse.y - containerRect.top - containerRect.height / 2,
      // }

      // console.log(container)
      console.log(mouse.x - containerRect.left, mouse.y - containerRect.top)

      const mouseOffset = {
        x: mouse.x - containerRect.left - containerRect.width / 2,
        y: mouse.y - containerRect.top - containerRect.height / 2,
      }
      // console.log('mouseOffset', mouseOffset)

      // Calculate the focal point relative to the container element
      // Convert the mouse point from it's position over the
      // effective area before the scale to the position
      // over the effective area after the scale.
      const focal = {
        x: (mouse.x - mouseOffset.x) * prevScale,
        y: (mouse.y - mouseOffset.y) * prevScale,
      }

      // The difference between the point after the scale and the point before the scale
      // plus the current translation after the scale
      // neutralized to no scale (as the transform scale will apply to the translation)
      const focal2 = {
        x:
          (focal.x / newScale - focal.x / prevScale + currPan.x * newScale) /
          newScale,
        y:
          (focal.y / newScale - focal.y / prevScale + currPan.y * newScale) /
          newScale,
      }

      // const focal = {
      //   x: (viewportRect.width / 2 - mouseOffset.x) * newScale,
      //   y: (viewportRect.height / 2 - mouseOffset.y) * newScale,
      // }

      instance.zoom(newScale, {
        animate: true,
        focal: focal,
      })

      // instance.pan(newPan.x, newPan.y, {
      //   animate: true,
      //   relative: true,
      // })

      // Pan relative to the current position
      // instance.pan(newPan.x, newPan.y, { relative: true })
      // instance.pan(newPan.x, newPan.y)

      const table = {
        scale: {
          prev: prevScale,
          new: newScale,
        },
        mouseX: {
          prev: mouse.x,
          new: mouseOffsetX,
        },
        mouseY: {
          prev: mouse.y,
          new: mouseOffsetY,
        },
        panX: {
          prev: currPan.x,
          new: newPanX,
        },
        panY: {
          prev: currPan.y,
          new: newPanY,
        },
      }

      console.table(table)

      ////////////////

      // // Get the current x, y, and scale
      // const { x: currX, y: currY } = instance.getPan()
      // const currScale = instance.getScale()

      // // Get the position and dimensions of the container element
      // const left = container.offsetLeft
      // const top = container.offsetTop
      // const width = container.offsetWidth
      // const height = container.offsetHeight

      // // Get the position of the mouse in the viewport
      // const mouseX = event.clientX
      // const mouseY = event.clientY

      // // Calculate the new scale based on the wheel delta
      // // Normalize to deltaX in case shift modifier is used on Mac
      // const delta =
      //   event.deltaY === 0 && event.deltaX ? event.deltaX : event.deltaY
      // const zoomLevel = delta / 1000
      // const newScale = currScale + zoomLevel

      // // Get the size of the viewport element
      // const viewportWidth = viewport.clientWidth
      // const viewportHeight = viewport.clientHeight

      // // Calculate the difference between the current mouse position and the center of the viewport
      // const diffX = (viewportWidth / 2 - currX - event.clientX) / currScale
      // const diffY = (viewportHeight / 2 - currY - event.clientY) / currScale

      // // Calculate the new x and y position of the container element
      // const newLeft = container.offsetLeft - diffX * newScale
      // const newTop = container.offsetTop - diffY * newScale

      // // Pan and zoom to the new position and scale
      // instance.pan(newLeft, newTop)
      // instance.zoom(newScale, { animate: true })

      ////////////////

      /////////
      // const targetX = event.clientX - viewport.offsetLeft
      // const targetY = event.clientY - viewport.offsetTop
      // const currentPan = panzoomInstance.value.getPan()
      // const viewportX =
      //   (targetX - currentPan.x) / panzoomInstance.value.getScale()
      // const viewportY =
      //   (targetY - currentPan.y) / panzoomInstance.value.getScale()
      /////////

      // instance.zoomToPoint(
      //   zoomLevel,
      //   {
      //     clientX: viewportX,
      //     clientY: viewportY,
      //   },
      //   { animate: true, transformOrigin: { x: 0, y: 0 } }
      // )

      // Adjust the pan position to keep the zoom centered on the mouse position
      // instance.pan(offsetLeft, offsetTop)

      // instance.zoom(toScale)
      // instance.pan(x, y)
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
  position: relative !important;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  overflow: hidden;
}

.panzoom-inner {
  position: relative; // Important
  display: inline-block;
  overflow: visible;
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
    box-shadow: 0 0 0 8px green;

    // Vertical line
    &:before {
      position: absolute;
      width: 50%;
      z-index: 100;
      height: 100%;
      left: 50%;
      border-left: 5px solid green;
    }

    // Horizonal line
    &:after {
      position: absolute;
      width: 100%;
      z-index: 100;
      height: 50%;
      top: 50%;
      border-top: 5px solid green;
    }
  }
}
</style>
