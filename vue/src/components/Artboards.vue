<template>
  <div id="artboards" v-if="artboards.length">
    <Artboard
      v-for="artboard in artboards"
        v-bind="artboard"
        :key="artboard.id"
        @add="add"
        @remove="remove"
      />
  </div>
  <div class="empty-state" v-else>
    <p>👋 Welcome to Shift! Click the "+" button to create your first screen size.</p>
    <NewArtboardButton @add="add"/>
  </div>
</template>

<script>
import Artboard from "./Artboard";
import NewArtboardButton from "./NewArtboardButton";

// Import localStorage Information
import { artboardsLocalStorage } from "../store/ArtboardsStore";

export default {
  name: "Artboards",
  components: {
    Artboard,
    NewArtboardButton
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
    add(artboard) {
      this.artboards.push({
        id: artboardsLocalStorage.uid++,
        width: 375, // TODO: dynamic
        height: 667 // TODO: dynamic
      });
    },
    remove(artboard) {
      this.artboards.splice(this.artboards.indexOf(artboard), 1);
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
  box-sizing: border-box;
  will-change: auto; // Activate GPU rendering

  &.is-vertical {
    flex-direction: column;
    align-items: center;
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .button-new-artboard {
    position: relative;
    top: 3rem;
    left: 0;
    right: 0;
  }
}
</style>
