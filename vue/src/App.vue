<template>
  <div id="app">
    <div id="toolbar"></div>
    <div id="canvas">
      <ArtboardsList/>
    </div>
  </div>
</template>

<script>
import ArtboardsList from "./components/ArtboardsList.vue";

export default {
  name: "app",
  components: {
    ArtboardsList // TODO: This should be inside of </Canvas>
  }
};
</script>

<style lang="scss">
@import './scss/_global';
</style>

<style lang="scss" scoped>
@import './scss/_variables';

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  background: $body-bg;
  height: 100%;
  width: 100%;
  overflow: hidden;
  overscroll-behavior: auto;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

#canvas {
  height: 100%;
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  
  flex-grow: 1;
  height: 100%;

  // Activate GPU rendering
  transform: translateZ(0);
}
</style>