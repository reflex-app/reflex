<template>
  <div id="artboards" v-if="artboards.length">
    <Artboard
      v-for="artboard in artboards"
      :key="artboard.id"
      v-bind="artboard"
      ref="artboard"
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
      let artboards = this.$store.state.artboards;
      let artboardsCounter = this.$store.state.artboards.length || 0;

      let uniqueID = () => {
        function check(val) {
          if (artboards.find(artboard => artboard.id === val)) {
            return false; // not unique
          } else {
            return true; // it's unique
          }
        }

        let increment = artboardsCounter; // 0+
        let flag = false;

        while(flag === false) {
          let val = increment++;
          const flag = check(val); // True or False

          if ( flag === true ) {
            return val;
          }
        }
      };

      this.$store.commit("addArtboard", {
        id: uniqueID(),
        title: 'Untitled',
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
      this.$store.commit("resizeArtboard", artboard);
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
