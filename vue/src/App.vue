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

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
