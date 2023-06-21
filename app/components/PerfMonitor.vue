<template>
  <div class="flex mx-4 px-1 py-1 gap-1 rounded-[2rem] border border-gray-300">
    <div
      :title="`CPU usage: ${cpu}%`"
      class="perf-stack-container"
      :class="cpuClass"
    >
      <div class="perf-ticks">
        <div class="perf-tick"></div>
        <div class="perf-tick"></div>
        <div class="perf-tick"></div>
      </div>
      <div class="needle-cover"></div>
      <div
        class="needle"
        :style="{ transform: `rotate(${cpuDegrees}deg)` }"
      ></div>
    </div>
    <div
      :title="`Memory usage: ${memory}%`"
      class="perf-stack-container"
      :class="memoryClass"
    >
      <div class="perf-ticks">
        <div class="perf-tick"></div>
        <div class="perf-tick"></div>
        <div class="perf-tick"></div>
      </div>
      <div class="needle-cover"></div>
      <div
        class="needle"
        :style="{ transform: `rotate(${memoryDegrees}deg)` }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ipcRenderer } from 'electron'
import isElectron from 'is-electron'
import { useArtboardsStore } from '@/store/artboards'

const artboards = useArtboardsStore()

let userAcceptedPerfWarnings: boolean | null = null
let userAlertedAboutPerfWarnings = false

const cpu = ref(0)
const memory = ref(0)

const cpuDegrees = computed(() => percentageToDegrees(cpu.value))
const memoryDegrees = computed(() => percentageToDegrees(memory.value))

const cpuClass = computed(() => {
  return colorLogic(cpu.value)
})

const memoryClass = computed(() => {
  return colorLogic(memory.value)
})

const colorLogic = (val: number) => {
  if (val < 40) {
    return 'bg-green'
  } else if (val < 70) {
    return 'bg-yellow'
  } else {
    return 'bg-red'
  }
}

onMounted(() => {
  if (isElectron()) {
    ipcRenderer.on('perf-warning', (event, message) => {
      if (!userAlertedAboutPerfWarnings) {
        perfHandler(event, message)
      }
    })

    ipcRenderer.on('perf-cpu', (e, value) => perfStreamHandler('cpu', value))

    ipcRenderer.on('perf-memory', (e, value) =>
      perfStreamHandler('memory', value)
    )
  }
})

function perfStreamHandler(type: 'cpu' | 'memory', value: number) {
  if (type === 'cpu') {
    cpu.value = value
  } else if (type === 'memory') {
    memory.value = value
  }
}

function percentageToDegrees(percentage: number): number {
  if (percentage < 0 || percentage > 100) {
    throw new Error('Percentage must be between 0 and 100')
  }

  // Convert the percentage to degrees, for a semi-circle.
  // Also, offset by -90 degrees so 0% is left, 50% is up, and 100% is right.
  let degrees = (percentage - 50) * 1.8

  return degrees
}

/**
 * Helper to disable WebViews when system performance may be affected
 */
function perfHandler(event: Event, message?: string) {
  userAlertedAboutPerfWarnings = true

  if (userAcceptedPerfWarnings === null) {
    // Immediately hide all webviews
    hideWebViews()

    if (
      confirm(
        `Performance warning! ${message} Continue anyway? Click "OK" to continue, or "Cancel" to hide all screens.`
      )
    ) {
      userAcceptedPerfWarnings = true
      showWebViews()
    } else {
      userAcceptedPerfWarnings = false

      // 1. Hide all Artboards, so user can re-enable
      artboards.list.map((artboard) => {
        artboard.isVisible = false
      })

      // 2. Re-enable WebViews
      showWebViews()

      // 3. Inform user what happened
      alert(
        'We have set all screen sizes to hidden so that performance should stabilize. To see them again, right-click a screen size in the side panel and click "Show".'
      )
    }
  }

  function hideWebViews() {
    document.querySelectorAll('webview').forEach((webview) => {
      webview.style.visibility = 'hidden'
    })
  }

  function showWebViews() {
    document.querySelectorAll('webview').forEach((webview) => {
      webview.style.visibility = 'visible'
    })
  }
}
</script>

<style lang="scss" scoped>
// Colors
$okay-color: #4aa564;
$okay-color--light: #E9F7ED;
$warning-color: #f9c642;
$warning-color--light: #fef7e3;
$alert-color: #cd2026;
$alert-color--light: #f8dede;

// Sizes
$needle-cover-size: 0.65rem;

@mixin perf-stack-colors($border-color, $bg-color, $tick-color) {
  background: $bg-color;
  border-color: $border-color;

  .needle-cover {
    border-color: $bg-color;
  }

  .perf-tick {
    background: $tick-color;
  }
}

.perf-stack-container {
  position: relative;
  border: 1px solid black;
  // padding: 0.4rem 1rem;
  height: 1.5rem;
  width: 2.5rem;
  // border-top-left-radius: 3rem;
  // border-top-right-radius: 3rem;
  border-radius: 3rem;
  overflow: hidden;

  &.bg-green {
    @include perf-stack-colors($okay-color, $okay-color--light, $okay-color);
  }
  &.bg-yellow {
    @include perf-stack-colors(
      $warning-color,
      $warning-color--light,
      $warning-color
    );
  }
  &.bg-red {
    @include perf-stack-colors($alert-color, $alert-color--light, $alert-color);
  }

  .perf-ticks {
    @apply flex gap-2 justify-center items-center h-full w-full relative;

    .perf-tick {
      height: 0.5rem;
      width: 0.1rem;
      content: '';
      // @apply bg-white/30;
      display: inline-block;
      border-radius: 0.2rem;

      &:nth-child(1) {
        transform: rotate(-45deg);
      }

      &:nth-child(2) {
        margin-top: -0.2rem;
      }

      &:nth-child(3) {
        transform: rotate(45deg);
      }
    }
  }

  $needle-width-base: 0.45rem;
  $needle-height: 1.1rem;
  $needle-width-tip: 0;
  $needle-color: #393939;

  .needle {
    position: absolute;
    bottom: 0;
    left: calc(50% - (#{$needle-width-base} / 2));
    width: 0;
    height: 0;
    border-left: $needle-width-base / 2 solid transparent; // half the base width
    border-right: $needle-width_base / 2 solid transparent; // half the base width
    border-bottom: $needle-height solid $needle-color; // height of the triangle
    transform-origin: center bottom;
  }

  .needle-cover {
    z-index: 1;
    position: absolute;
    left: calc(50% - (#{$needle-cover-size}/ 2));
    bottom: calc(-#{$needle-cover-size} * 0.5);
    height: $needle-cover-size;
    width: $needle-cover-size;
    content: '';
    background: rgba(#3d3d3d, 100%);
    border-radius: 100%;
    border: 1px solid white;
  }
}

@keyframes speed {
  0% {
    transform: rotate(0);
  }
  40% {
    transform: rotate(45deg);
  }
  55% {
    transform: rotate(60deg);
  }
  75% {
    transform: rotate(-45deg);
  }
}
</style>
