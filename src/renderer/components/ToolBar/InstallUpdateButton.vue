<template>
  <div class="install-button-container" v-if="progress !== null">
    <ProgressIndicator :percentage="progress" @click="triggerInstall" />
  </div>
</template>

<script>
import isElectron from "is-electron";
import { ipcRenderer } from "electron";
import ProgressIndicator from "./ProgressIndicator";

export default {
  components: {
    ProgressIndicator
  },
  data() {
    return {
      progress: null
    };
  },
  computed: {
    percentage() {
      return `${this.progress}%`;
    },
    readyToInstallUpdate() {
      if (this.progress && this.progress === 100) {
        return true;
      }
      return false;
    }
  },
  mounted() {
    if (isElectron()) {
      ipcRenderer.on("DOWNLOAD_PROGRESS", (event, progress) => {
        this.progress = Number(progress);
      });
    }
  },
  methods: {
    triggerInstall() {
      ipcRenderer.send("TRIGGER_INSTALL");
    }
  }
};
</script>

<style lang="scss" scoped>
.install-button-container {
  position: relative;
}
</style>