<template>
  <div class="container">
    <ToolBar />
    <slot />
  </div>
</template>

<script lang="ts">
import isElectron from 'is-electron'
import ToolBar from '@/components/ToolBar/index.vue'
import { ipcRenderer } from 'electron'

export default {
  components: {
    ToolBar,
  },
  mounted() {
    // TODO: Add test here

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
            // TODO: Add typings for `main` and `renderer` to 
            // ensure that the channel name is correct
            ipcRenderer.invoke('reload-window')
          }, 150)
        }
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  width: 100%;
}
</style>
