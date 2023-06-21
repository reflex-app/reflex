<template>
  <div class="flex px-4 gap-2">
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
  if (userAcceptedPerfWarnings === null) {
    userAlertedAboutPerfWarnings = true

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
$warning-color: #f9c642;
$alert-color: #cd2026;

// Sizes
$needle-cover-size: 3.5rem;

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
    background: rgba($okay-color, 15%);
    border-color: $okay-color;

    .perf-tick {
      background: $okay-color;
    }
  }
  &.bg-yellow {
    background: rgba($warning-color, 15%);
    border-color: $warning-color;

    .perf-tick {
      background: $warning-color;
    }
  }
  &.bg-red {
    background: rgba($alert-color, 15%);
    border-color: $alert-color;

    .perf-tick {
      background: $alert-color;
    }
  }

  .perf-ticks {
    @apply flex gap-2 justify-center items-center h-full w-full relative;

    .perf-tick {
      height: 0.5rem;
      width: 0.1rem;
      content: '';
      // @apply bg-white/30;
      display: inline-block;

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

  .needle {
    position: absolute;
    left: 50%;
    bottom: -0.125rem;
    height: 1.2rem;
    width: 0.2rem;
    content: '';
    background: #3d3d3d;
    border-top-left-radius: 100%;
    border-top-right-radius: 100%;
    transform-origin: center bottom;
    transition: all 3s ease-in;
    // animation: speed 5s infinite;
  }

  // .needle-cover {
  //   position: absolute;
  //   left: calc(50% - (#{$needle-cover-size}/ 2));
  //   // left: 50%;
  //   bottom: calc(-#{$needle-cover-size} * 0.9);
  //   height: $needle-cover-size;
  //   width: $needle-cover-size;
  //   content: '';
  //   background: rgba(black, 100%);
  //   border-radius: 100%;
  // }
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
