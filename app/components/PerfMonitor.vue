<template>
  <div class="flex px-4 gap-2">
    <div :title="`CPU usage: ${cpu}%`" class="perf-stack-container">
      <div v-if="cpu > 20" class="perf-stack"></div>
      <div v-if="cpu >= 50" class="perf-stack"></div>
      <div v-if="cpu >= 80" class="perf-stack"></div>
    </div>
    <div :title="`Memory usage: ${memory}%`" class="perf-stack-container">
      <div v-if="cpu > 20" class="perf-stack"></div>
      <div v-else-if="cpu >= 50" class="perf-stack"></div>
      <div v-else-if="cpu >= 80" class="perf-stack"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ipcRenderer } from 'electron'
import isElectron from 'is-electron'
import { useArtboardsStore } from '@/store/artboards'

const artboards = useArtboardsStore()

const cpu = ref(0)
const memory = ref(0)

onMounted(() => {
  if (isElectron()) {
    ipcRenderer.on('perf-warning', perfHandler)

    ipcRenderer.on('perf-cpu', (e, value) => perfStreamHandler('cpu', value))

    ipcRenderer.on('perf-memory', (e, value) =>
      perfStreamHandler('memory', value)
    )
  }
})

let userAcceptedPerfWarnings: boolean | null = null

function perfStreamHandler(type: 'cpu' | 'memory', value: number) {
  if (type === 'cpu') {
    cpu.value = value
  } else if (type === 'memory') {
    memory.value = value
  }
}

/**
 * Helper to disable WebViews when system performance may be affected
 */
function perfHandler(event: Event, message?: string) {
  if (userAcceptedPerfWarnings === null) {
    // Immediately hide all webviews
    hideWebViews()

    if (confirm(`Performance warning! ${message} Continue anyway?`)) {
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
.perf-stack-container {
    @apply flex flex-col-reverse gap-1
}

.perf-stack {
    @apply h-1 w-4 bg-black rounded-sm; 

    &:nth-child(3) {
        @apply bg-gray-500;
    }
   
    &:nth-child(2) {
        @apply bg-gray-400;
    }
    
    &:nth-child(1) {
        @apply bg-gray-300;
    }
}
</style>
