<template>
  <div>
    <ToolBar />
    <nuxt />
  </div>
</template>

<script>
import { remote, ipcRenderer } from "electron";
import isElectron from "is-electron";
import ToolBar from "@/components/ToolBar";

export default {
  components: {
    ToolBar
  },
  mounted() {
    // Global listeners
    if (isElectron()) {
      ipcRenderer.on("menu_reset-app", () => {
        if (
          confirm(
            `Are you sure you want to reset all ${remote.app.name} data and settings? Click "OK" to reset.`
          )
        ) {
          window.localStorage.clear();

          setTimeout(() => {
            remote.getCurrentWindow().reload();
          }, 150);
        }
      });
    }
  }
};
</script>