<template>
  <div>{{ state }}</div>
</template>

<script lang="ts">
import Vue from 'vue'
import { useEventListener } from '@vueuse/core'
import {
  ref,
  watch,
  reactive,
  onMounted,
  computed,
} from '@nuxtjs/composition-api'
import isEqual from 'lodash/isEqual'
import mitt, { Emitter } from 'mitt'

// (DOM) Event Listeners
// (DOM) Event Handlers
// Event bus
// State
// App Logic

const interactions = {
  DRAG: 'pan',
  CLICK_ARTBOARD: 'select', // select just one
  CMD_SCROLL: 'zoom',
  CMD_DRAG: 'select', // select multiple
}

export default Vue.extend({
  setup(props, ctx) {
    type Events = {
      isMouseDown: boolean
      isCtrlPressed: boolean
      isDragging: boolean
      isDragSelecting: boolean
    }

    const state = reactive<Events>({
      isDragging: false,
      isMouseDown: false,
      isCtrlPressed: false,
      isDragSelecting: computed(() => {
        return this.isDragging
      }),
    })

    // watch(
    //   () => state,
    //   (newVal, oldVal) => {
    //     if (isEqual(oldVal, newVal)) return false
    //     console.log('Changed', { oldVal }, { newVal })
    //   },
    //   { deep: true }
    // )

    const emitter: Emitter<Events> = mitt<Events>()
    // emitter.on('*', (type, e) => console.log(type, e))

    onMounted(() => {
      console.log('init')

      // Event Listeners
      // CMD/CTRL keyboard shortcuts
      useEventListener(document, 'keydown', keyboardHandler)
      useEventListener(document, 'keyup', () => {
        // Emit event
        emitter.emit('isCtrlPressed', false) // TODO: This should be handled elsewhere
      })

      // Handle click/drag events
      useEventListener(document, 'mousedown', onMouseDown) // start
      useEventListener(document, 'mouseup', onMouseUp) // end
      // TODO: Add touch, gesture as well

      ////////////////////////////////////////////////
      ////////////////////////////////////////////////
      ////////////////////////////////////////////////
      // Automatically update state on matching emit()
      emitter.on('*', (type, val) => {
        if (state.hasOwnProperty(type)) {
          state[type] = val
          console.log(`${type} set to ${val}`)
        } else {
          console.warn('Unknown event not saved to state', type, val)
        }
      })

      ////////////////////////////////////////////////
      ////////////////////////////////////////////////
      ////////////////////////////////////////////////
      // React to state changes
      watch(
        () => state,
        (newVal, oldVal) => {
          // DRAGGING (aka "panning")
          // Allow dragging canvas
          // Mouse should be down, ctrl/cmd should not be pressed
          if (state.isMouseDown && !state.isCtrlPressed) {
            emitter.emit('isDragging', true)
          }
          // Watch for when user stops dragging
          if (state.isDragging && !state.isMouseDown) {
            emitter.emit('isDragging', false)
          }

          ////////////////////////
          // CMD + Drag => Select
          if (state.isCtrlPressed && state.isDragging) {
            emitter.emit('isDragSelecting', true)
          }
        },
        { deep: true }
      )
    })

    const onMouseDown = (e: MouseEvent) => {
      // Always make sure CTRL/CMD key is NOT pressed
      if (state.isCtrlPressed) {
        console.log('Control key is pressed; handling w/ handleCtrlEvents')
        return false
      }

      // Emit event
      emitter.emit('isMouseDown', true)

      // 1. Drag
      // 2. Click artboard
    }
    const onMouseUp = (e: Event) => {
      // Emit event
      emitter.emit('isMouseDown', false)
    }

    /**
     * Toggles the pan/zoom controls
     * When on, users can pan and zoom
     * When off, users can only interact inside of Screens
     */
    const keyboardHandler = (e) => {
      // If user keeps holding the key down,
      // prevent firing repetitively and only counting once
      if (e.repeat) {
        return
      }

      // Only check for CMD/CTRL key to be held
      const isCtrlPressed = isCtrlKeyPressed(e)

      // Emit event
      emitter.emit('isCtrlPressed', true)

      // Handle CTRL+* commands
      if (isCtrlPressed) handleCtrlEvents(e)
    }

    const handleCtrlEvents = (e: Event) => {
      // You can assume the CMD/CTRL key is pressed
      // Let's wait for next user interaction
      let interaction = ref<string>()

      // 1. CMD+Scroll --> Zoom in/out
      // 1. Use Panzoom; disable Viselect
      // 2. CMD+Drag --> Allow drag selections
      // 2. Use Viselect; disable Panzoom until key up

      // Handlers
      const onWheel = (e: WheelEvent) => {
        // 1. CMD/CTRL + Wheel => Zoom in/out
        // 1. Use Panzoom; disable Viselect
        interaction.value = interactions.CMD_SCROLL

        // // Disable Viselect
        // this.disableSelections()

        // // Enable Panzoom
        // this.$store.commit('interactions/setPanzoomState', {
        //   value: true,
        // })
        // // Update state
        // this.$store.commit('interactions/interactionSetState', {
        //   key: 'isPanzooming',
        //   value: true,
        // })

        // Let the event pass through...
        // User may refire this event many times
      }

      const onMouseUp = (e: MouseEvent) => {
        console.log('mouse up')

        // Emit event
        emitter.emit('isMouseDown', false)

        document.removeEventListener('mouseup', onMouseUp)
      }

      const onMouseDrag = (e: MouseEvent) => {
        // Only watch if mouse is down & moving
        if (!state.isMouseDown) {
          console.warn('Mouse is not down! Should not be firing')
        }

        console.log('mouse move')
        // Emit event
        emitter.emit('isMouseDown', true)

        // 2. CMD+Drag --> Allow drag selections
        // 2. Use Viselect; disable Panzoom until key up
        interaction.value = interactions.CMD_DRAG

        // // Disable Panzoom
        // this.$store.commit('interactions/setPanzoomState', {
        //   value: false,
        // })

        // // Enable drag
        // this.enableSelections()

        // // Listen for end event
        // const onMouseUp = (e: Event) => {
        //   document.removeEventListener('mouseup', onMouseUp) // remove the listener

        //   // Disable drag
        //   this.disableSelections()

        //   // Re-enable Panzoom
        //   this.$store.commit('interactions/setPanzoomState', {
        //     value: true,
        //   })
        // }

        // Wait until user mouseup (stop dragging)
        document.removeEventListener('mousemove', onMouseDrag) // Remove this listener
        document.addEventListener('mouseup', onMouseUp)
      }

      // Add interaction triggers
      document.addEventListener('wheel', onWheel) // Listen for mouse wheel zoom in/out

      if (state.isMouseDown) {
        console.log('Waiting for mouse drag')
        document.addEventListener('mousemove', onMouseDrag) // Listen for mouse wheel zoom in/out
      }
    }

    // Return to template
    return {
      state,
    }
  },
})

function isCtrlKeyPressed(e) {
  return e.ctrlKey || e.metaKey ? true : false
}
</script>

<style lang="scss" scoped></style>
