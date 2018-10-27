<template>
  <div id="app">
    <Toolbar/>
    <div id="canvas">
      <ArtboardsList/>
    </div>
  </div>
</template>

<script>
import Toolbar from "./components/Toolbar.vue";
import ArtboardsList from "./components/ArtboardsList.vue";

export default {
  name: "app",
  components: {
    ArtboardsList, // TODO: This should be inside of </Canvas>
    Toolbar
  }
};
</script>

<style lang="scss">
@import "./scss/_global";
</style>

<style lang="scss" scoped>
@import "./scss/_variables";

#app {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  background: $body-bg;
  overflow: hidden;
  overscroll-behavior: auto;
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