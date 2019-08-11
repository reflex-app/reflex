<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
ipcRenderer.on("message", function(event, text) {
  console.log(event, text);
});

export default {
  name: "Reflex"
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
  overflow: hidden;
  overscroll-behavior: auto;
  border-radius: 8px;
  background: $body-bg;
}
</style>
