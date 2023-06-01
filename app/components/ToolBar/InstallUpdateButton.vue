<template>
  <div v-if="progress !== null" class="install-button-container">
    <ProgressIndicator :percentage="progress" @click="triggerInstall" />
  </div>
</template>

<script lang="ts">
import isElectron from 'is-electron'
import ProgressIndicator from './ProgressIndicator.vue'
import { ipcRenderer } from 'electron'

export default {
  components: {
    ProgressIndicator,
  },
  data() {
    return {
      progress: null,
    }
  },
  computed: {
    percentage() {
      return `${this.progress}%`
    },
    readyToInstallUpdate() {
      if (this.progress && this.progress === 100) {
        return true
      }
      return false
    },
  },
  mounted() {
    if (isElectron()) {
      ipcRenderer.on('DOWNLOAD_PROGRESS', (event, progress) => {
        console.log('Downloading update...', progress)
        this.progress = Number(progress)
      })
    }
  },
  methods: {
    triggerInstall() {
      ipcRenderer.send('TRIGGER_INSTALL')
    },
  },
}
</script>

<style lang="scss" scoped>
.install-button-container {
  position: relative;
}
</style>
