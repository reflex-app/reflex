<template>
  <div id="artboards" v-if="artboards.length">
    <ArtboardView 
      v-for="artboard in artboards"
      :key="artboard.id"
      :height="artboard.height"
      :width="artboard.width"
      />
  </div>
</template>

<script>
import ArtboardView from "./ArtboardView";

// Import localStorage Information
import { artboardsLocalStorage } from "../store/ArtboardsStore";

export default {
  name: "ArtboardsList",
  components: {
    ArtboardView
  },
  data() {
    return {
      artboards: artboardsLocalStorage.fetch()
    };
  },
  watch: {
    artboards: {
      handler: function(artboards) {
        artboardsLocalStorage.save(artboards);
      },
      deep: true
    }
  },
  methods: {
    add() {
      this.artboards.push({
        id: artboardsLocalStorage.uid++,
        width: 400, // TODO: dynamic
        height: 400 // TODO: dynamic
      });
    }
  }
};
</script>

<style lang="scss" scoped>
#artboards {
  position: relative;
  display: inline-flex;
  flex-direction: row;
  flex-wrap: nowrap;
  user-select: none;
  background: #3c4046;
  border-radius: 1rem;
  box-sizing: border-box;
  padding: 8rem;
  will-change: auto; // Activate GPU rendering

  &.is-vertical {
    flex-direction: column;
    align-items: center;
  }
}
</style>
