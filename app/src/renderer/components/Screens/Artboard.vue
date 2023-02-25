<template>
  <!-- Allow pointer-events when panzoom is enabled -->
  <!-- The 'panzoom-exclude' class allows us to ignore Panzoom click events on a certain element -->
  <!-- ... and then we use Selection to select just one artboard -->
  <div
    class="artboard-container"
    :class="{ 'panzoom-exclude': state.panzoomEnabled }"
  >
    <div
      v-show="isVisible"
      ref="artboard"
      :artboard-id="props.id"
      class="artboard"
      :class="{
        'is-hover': state.isHover,
        'is-selected': state.isSelected,
      }"
      @mouseover="hoverStart(props.id)"
      @mouseout="hoverEnd(props.id)"
      @click.right="rightClickHandler()"
    >
      <div class="artboard__top">
        <div>
          <span class="title">{{ props.title }}</span>
          <span class="dimension">{{ props.width }} x {{ props.height }}</span>
        </div>
        <!-- Show a loader when state.isLoading == true -->
        <div v-show="state.isLoading" class="artboard__loader is-loading">
          <div class="content">
            <div class="lds-ripple">
              <div />
              <div />
            </div>
          </div>
        </div>
      </div>
      <div class="artboard__keypoints" />
      <div
        ref="artboardResizable"
        class="artboard__content"
        :class="{
          'layout--horizontal': state.horizontalLayout,
          'is-hover': state.isHover,
          'is-selected': state.isSelected,
        }"
        :style="{ height: props.height + 'px', width: props.width + 'px' }"
      >
        <div class="content__frame">
          <WebPage
            :id="props.id"
            :artboard-id="props.id"
            ref="frame"
            :allow-interactions="state.canInteractWithWebContext"
            class="webview"
            @loadstart="state.isLoading = true"
            @loadend="state.isLoading = false"
            @scroll="updateScrollPosition"
          />
        </div>

        <!-- TODO: Re-enable -->
        <!-- <div class="artboard__cross-browser-screenshots">
          <CrossBrowserScreenshots
            ref="cross-browser-DOM"
            :height="height"
            :width="width"
            :x="scrollPosition.x"
            :y="scrollPosition.y"
          />
        </div> -->
        <div v-show="state.isHover" class="artboard__handles">
          <div
            class="handle_right"
            title="Resize"
            @mousedown="triggerResize($event, 'horizontal')"
          />
          <div
            class="handle_bottom"
            title="Resize"
            @mousedown="triggerResize($event, 'vertical')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  reactive,
  computed,
  onMounted,
  ref,
  Ref,
} from '@nuxtjs/composition-api'
import { defineEmits } from 'vue'
import rightClickMenu from '~/mixins/rightClickMenu'
import WebPage from './WebPage.vue'
import { useHistoryStore } from '~/store/history'
import { useSelectedArtboardsStore } from '~/store/selectedArtboards'
import { useHoverArtboardsStore } from '~/store/hoverArtboards'
import { useInteractionStore } from '~/store/interactions'
import CrossBrowserScreenshots from '~/components/CrossBrowser/Screenshots/CrossBrowserScreenshots.vue'

const history = useHistoryStore()
const selectedArtboards = useSelectedArtboardsStore()
const hoverArtboards = useHoverArtboardsStore()
const interactions = useInteractionStore()

const state = reactive({
  isLoading: false,
  horizontalLayout: true,
  panzoomEnabled: computed(() => interactions.panzoomEnabled),
  isInteracting: computed(() => interactions.isInteracting),
  isHover: computed(() =>
    computedVars.hoverArtboards.filter((item) => item === props.id).length
      ? true
      : false
  ),
  isSelected: computed(() => {
    const isSelected = computedVars.selectedArtboards.filter(
      (item) => item === props.id
    )
    return isSelected.length ? true : false
  }),

  /**
   * Only allow interacting with the underlying
   * artboard (WebView) when the artboard is selected
   * and the user is not dragging a selection area
   */
  // canInteractWithWebContext: computed(() => {
  //   if (this.isSelected === false) return false // Not selected!
  //   if (this.isSelected && this.isInteracting === false) {
  //     return true // Can interact!
  //   } else {
  //     interactions.setWebInteractionState(false) // Update global state
  //     return false // Otherwise, false
  //   }
  // }),
  canInteractWithWebContext: computed(() => {
    if (state.isSelected === false) return false // Not selected!
    if (state.isSelected && state.isInteracting === false) {
      return true // Can interact!
    } else {
      interactions.setWebInteractionState(false) // Update global state
      return false // Otherwise, false
    }
  }),
})

const computedVars = reactive({
  url: computed(() => history.currentPage.url),
  selectedArtboards: computed(() => selectedArtboards.list),
  hoverArtboards: computed(() => hoverArtboards.list),
})

// Template refs
const frame = ref<Ref | null>(null)
const artboard = ref()
const artboardResizable = ref()

const scrollPosition = reactive({
  x: 0,
  y: 0,
})

const props = defineProps({
  title: {
    type: String,
    default: 'Artboard',
  },
  id: {
    type: String,
    default: '123',
  },
  height: {
    type: Number,
    default: 0,
  },
  width: {
    type: Number,
    default: 0,
  },
  selectedItems: {
    type: Array,
    default: () => [],
  },
  isVisible: Boolean,
  viewportObserver: {
    type: IntersectionObserver,
    default: null,
  },
})

const emit = defineEmits(['resize'])

onMounted(async () => {
  // Remove any leftover selected artboards
  // @TODO: This should be done from VueX Store, or wiped before quitting
  selectedArtboards.empty()

  // IntersectionObserver on the WebView element
  // Helps make sure we can reliably screenshot and other features
  // The actual Observer comes from the parent component
  if (props.viewportObserver) {
    if (!frame.value) return false
    const { $el } = frame.value
    props.viewportObserver.observe($el)
  } else {
    console.warn(
      'No IntersectionObserver found! Canvas may not track artboard positions correctly.'
    )
  }
})

function updateScrollPosition({ x, y }) {
  scrollPosition.x = x
  scrollPosition.y = y
}

function rightClickHandler() {
  rightClickMenu(this.$store, {
    title: props.title,
    id: props.id,
    width: props.width,
    height: props.height,
    isVisible: props.isVisible,
  })
}

// Limits the size of an artboard
function validateArtboardSizeInput(name, value) {
  // @TODO: Refactor this into the size editor
  const minSize = 50
  const maxSize = 9999

  // Make sure we're working with a number
  const newValue = typeof value === 'number' ? value : Number(parseInt(value))

  // Change the data based on the name
  let oldValue = ''
  if (name === 'height') {
    oldValue = this.artboard.height
  } else if (name === 'width') {
    oldValue = this.artboard.width
  }

  // If no change
  if (oldValue === newValue) {
    return
  }

  // Min & Max
  if (newValue > maxSize || newValue < minSize) {
    return false
    // Size is within range!
  } else if (name === 'height') {
    this.artboard.height = newValue
  } else if (name === 'width') {
    this.artboard.width = newValue
  } else {
    console.log('out of range')
  }
}

/**
 * Resize an artboard/screen
 * e = event
 * direction = horizontal, vertical
 */
function triggerResize(event, direction) {
  console.log('should resize', event, direction)
  const vm = this

  const parent = artboardResizable.value
  const resizable = parent
  const startX = event.clientX
  const startY = event.clientY

  const startWidth = parseInt(
    document.defaultView.getComputedStyle(resizable).width,
    10
  )
  const startHeight = parseInt(
    document.defaultView.getComputedStyle(resizable).height,
    10
  )

  document.documentElement.addEventListener('mousedown', doStart)
  document.documentElement.addEventListener('mousemove', doDrag)
  document.documentElement.addEventListener('mouseup', stopDrag)

  // Pause the panzoom
  // if (this.$root.$panzoom.state.isEnabled === true) {
  //   this.$root.$panzoom.disable() // TODO: Cleaner solution that polluting document?
  // }

  function doStart() {
    // Update global state
    interactions.interactionSetState({
      key: 'isResizingArtboard',
      value: true,
    })
  }

  // Resize objects
  function doDrag(e) {
    // This event needs to be debounced, as it's called on mousemove
    // Debounce via https://gomakethings.com/debouncing-your-javascript-events/
    switch (direction) {
      case 'horizontal':
        // Run our scroll functions
        resizable.style.width = startWidth + e.clientX - startX + 'px'
        // Update the dimensions in the UI
        emit('resize', {
          id: props.id,
          width: parseInt(resizable.style.width, 10),
          height: startHeight,
        })
        break
      case 'vertical':
        // Run our scroll functions
        resizable.style.height = startHeight + e.clientY - startY + 'px'
        // Update the dimensions in the UI
        emit('resize', {
          id: props.id,
          height: parseInt(resizable.style.height, 10),
          width: startWidth,
        })
        break
    }
  }

  function stopDrag() {
    document.documentElement.removeEventListener('mousedown', doStart)
    document.documentElement.removeEventListener('mousemove', doDrag)
    document.documentElement.removeEventListener('mouseup', stopDrag)

    // Re-enable pointer events on frames
    // const frames = document.getElementsByClassName('frame')

    // Re-enable the panzoom
    // vm.$root.$panzoom.enable() // TODO: Cleaner solution that polluting document?

    // Update global state
    interactions.interactionSetState({
      key: 'isResizingArtboard',
      value: false,
    })
  }
}

function hoverStart(id) {
  hoverArtboards.addHover(id)
}

function hoverEnd(id) {
  hoverArtboards.removeHover(id)
}
</script>

<style lang="scss" scoped>
@import '@/scss/_variables';
$artboard-handle-height: 1.5rem;

.artboard-container {
  display: block;
  position: relative;
  width: auto;
  height: auto;
  align-self: flex-start; // Prevent stretching to flex container height
}

.artboard {
  padding: 1rem;
  // padding-right: 1.5rem;
  // padding-bottom: $artboard-handle-height * 3;
  border: 3px solid transparent;
  position: relative;
  display: block;
  flex: 1 0 auto;
  min-height: 10px;
  min-width: 10px;
  margin: 0 3.5rem;

  &:first-child {
    margin-left: 3.5rem;
  }

  &:first-child {
    margin-right: 3.5rem;
  }

  .artboard__top {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;

    & > *:not(:first-child) {
      margin-left: 16px;
    }

    .title {
      color: black;
      margin-right: 1rem;
    }

    .dimension {
      color: #636363;
    }
  }

  .webview {
    transition: all 250ms ease-out;
  }

  $artboard-content-radius: 1rem;
  .artboard__content {
    width: auto;
    height: auto;
    position: relative;
    z-index: 1;
    box-sizing: border-box;
    transition: border-radius 50ms ease-out, box-shadow 200ms ease-out; // animate the hover effects

    &:hover,
    &.is-hover {
      cursor: pointer;
      box-shadow: 0 0 1rem rgba(white, 1), 0 3rem 5rem 1rem rgba(#000, 0.2);

      & .content__frame {
        border-radius: $artboard-content-radius;
      }
    }

    &.is-selected {
      .content__frame {
        background: rgba(226, 239, 255, 0.63);
        box-shadow: 0 0 1rem rgba(blue, 1);
        // Remove the rounded corners once selected
        border-radius: 0;
      }
    }

    .content__frame {
      min-width: 100%; // the outer div is always set to the accurate artboard width
      min-height: 100%; // the outer div is always set to the accurate artboard height
      border: none;
      overflow: hidden;
      z-index: 1;
      box-sizing: border-box;
      transition: box-shadow 200ms ease-out; // animate the shadow when selecting the frame
    }

    &.layout--horizontal {
      display: flex;
      flex-direction: row;
      // flex-wrap: wrap;
    }

    .artboard__cross-browser-screenshots {
      position: relative;
      width: auto;
    }
  }

  .artboard__handles {
    position: absolute;
    bottom: 0;
    right: 0;
    height: 100%;
    width: 100%;
    z-index: 0;

    .handle_right,
    .handle_bottom {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 3rem;

      &:hover {
        background: rgba($accent-color, 0.1);
      }

      &:hover:after {
        background: darken($accent-color, 20%);
      }

      &:active:after {
        z-index: 0;
        background: none;
        border-color: $accent-color;
      }

      &:after {
        content: '';
        position: relative;
        background: $accent-color;
        height: $artboard-handle-height;
        width: $artboard-handle-height;
        position: absolute;
        border-radius: 100%;
        border: 3px solid transparent;
        z-index: 0;
      }
    }

    .handle_right {
      right: calc(-#{$artboard-handle-height} * 4);
      cursor: ew-resize;
      height: 100%;
      width: 0;
      border-top-right-radius: 1rem;
      border-bottom-right-radius: 1rem;
    }

    .handle_bottom {
      left: 0;
      bottom: calc(-#{$artboard-handle-height} * 4);
      cursor: ns-resize;
      height: 0;
      width: 100%;
      border-bottom-left-radius: 1rem;
      border-bottom-right-radius: 1rem;
    }
  }

  & .artboard__loader {
    position: absolute;
    top: 0;
    right: 2rem;

    .content {
      left: 50%;
      transform: translateX(-50%);
      color: white;
      position: absolute;
    }

    &.is-loading {
      display: block;
    }

    .lds-ripple {
      display: inline-block;
      position: relative;
      width: 64px;
      height: 64px;
    }

    .lds-ripple div {
      position: absolute;
      border: 4px solid $accent-color;
      opacity: 1;
      border-radius: 50%;
      animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
    }

    .lds-ripple div:nth-child(2) {
      animation-delay: -0.5s;
    }

    @keyframes lds-ripple {
      0% {
        top: 20px;
        left: 20px;
        width: 0;
        height: 0;
        opacity: 1;
      }

      100% {
        top: -1px;
        left: -1px;
        width: 42px;
        height: 42px;
        opacity: 0;
      }
    }
  }
}
</style>
