<template>
  <div id="artboards" v-if="artboards.length">
    <Artboard
      v-for="artboard in artboards"
      :key="artboard.id"
      v-bind="artboard"
      ref="artboard"
      @resize="resize"
    />
  </div>
  <!-- Show empty state if no artboards exist -->
  <div class="empty-state" v-else>
    <img src="@/assets/ftu-vector.svg" class="empty-state__image" alt="Welcome to Shift graphic">
    <span class="empty-state__title">Welcome to Shift</span>
    <p class="empty-state__body">You can create new screens in the Screens panel on the left.</p>
  </div>
</template>

<script>
import Artboard from "./Artboard";

export default {
  name: "Artboards",
  components: {
    Artboard
  },
  watch: {
    artboards: function() {
      // @TODO: Panzoom is currently not properly centering
      // Center the canvas when an artboard is added/deleted
      document.$panzoom.center();
    }
  },
  computed: {
    artboards() {
      return this.$store.state.artboards;
    }
  },
  methods: {
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
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;

  .empty-state__image {
    margin-bottom: 2rem;
  }

  .empty-state__title {
    font-size: 1.6rem;
  }

  .empty-state__body {
    line-height: 1.5;
    max-width: 250px;
  }
}
</style>
