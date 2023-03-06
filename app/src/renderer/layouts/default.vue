<template>
  <div class="container">
    <nuxt />
  </div>
</template>

<script setup lang="ts">
import { ipcRenderer } from 'electron' // TODO Migrate to @electron/remote
import isElectron from 'is-electron'

import remote from '@electron/remote'
import { onMounted, computed, ref } from 'vue'

onMounted(() => {
  // TODO: get app version
  // console.info(`Version: ${remote.app.getVersion()}`)

  // Global listeners
  if (isElectron()) {
    ipcRenderer.on('menu_reset-app', () => {
      if (
        confirm(
          `Are you sure you want to reset all data and settings? Click "OK" to reset.`
        )
      ) {
        window.localStorage.clear()

        setTimeout(() => {
          // TODO: replace this with IPC
          remote.getCurrentWindow().reload()
        }, 150)
      }
    })
  }
})
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  width: 100%;
}
</style>
