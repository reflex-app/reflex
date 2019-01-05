<template>
  <div id="artboards" v-if="artboards.length">
    <Artboard
      v-for="artboard in artboards"
      v-bind="artboard"
      ref="artboard"
      :key="artboard.id"
      @add="add"
      @remove="remove"
      @resize="resize"
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

export default {
  name: "Artboards",
  components: {
    Artboard,
    NewArtboardButton
  },
  computed: {
    artboards() {
      return this.$store.state.artboards;
    }
  },
  methods: {
    add() {
      const artboards = this.$store.state.artboards;
      const next_id = artboards.length || 0;

      this.$store.commit("addArtboard", {
        id: next_id,
        width: 375, // TODO: dynamic
        height: 667 // TODO: dynamic
      });
    },
    remove(id) {
      // Remove
      this.$store.commit("removeArtboard", id);
      
      // TODO: Add test for deleting multiple selected artboards
      // eslint-disable-next-line
      // console.log(id);

      // function filterArtboards(artboards) {
      //   return artboards.filter(artboard => {
      //     // eslint-disable-next-line
      //     console.log(artboard);
      //     // return artboard.state.isSelected
      //   });
      // }

      // eslint-disable-next-line
      // console.log(filterArtboards(this.artboards));
      // eslint-disable-next-line
      // console.log(this.$refs.artboard[id]);
    },
    resize(artboard) {
      // TODO: Update localstorage
      // artboardsLocalStorage.updateSize(artboard);
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

#sidebar {
  position: fixed;
  top: 100;
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
