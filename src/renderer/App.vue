<template>
  <div id="app">
    <ToolBar ref="toolbar" />
    <router-view />
  </div>
</template>

<script>
import ToolBar from "@/components/ToolBar";
/**
 * Configure for Electron messages
 */
import { ipcRenderer } from "electron";
ipcRenderer.on("message", function(event, text) {
  console.log(event, text);
});

export default {
  name: "Reflex",
  components: {
    ToolBar,
  }
};
</script>

<style lang="scss" scoped>
@import "./scss/_variables";

#app {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  overscroll-behavior: auto;
  border-radius: 8px;
  background: $body-bg;
}
</style>
