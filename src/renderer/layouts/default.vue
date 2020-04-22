<template>
  <div class="container">
    <ToolBar />
    <FullScreenWebPage />
    <nuxt />
  </div>
</template>

<script>
import { remote, ipcRenderer } from 'electron'
import isElectron from 'is-electron'
import ToolBar from '@/components/ToolBar'
import FullScreenWebPage from '@/components/Screens/FullScreenWebPage.vue'

export default {
  components: {
    ToolBar,
    FullScreenWebPage,
  },
  mounted() {
    // Global listeners
    if (isElectron()) {
      ipcRenderer.on('menu_reset-app', () => {
        if (
          confirm(
            `Are you sure you want to reset all ${remote.app.name} data and settings? Click "OK" to reset.`
          )
        ) {
          window.localStorage.clear()

          setTimeout(() => {
            remote.getCurrentWindow().reload()
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
