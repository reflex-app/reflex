<template>
  <div>
    <div v-if="artboards.length" id="artboards">
      <Artboard
        v-for="(artboard, index) in artboards"
        v-bind="artboard"
        :key="artboard.id"
        :index="index"
        :artboard-id="artboard.id"
        :selectedItems="selectedArtboards"
        ref="artboard"
        class="artboard"
        @resize="resize"
      />
    </div>
    <!-- Show empty state if no artboards exist -->
    <WelcomeScreen v-else />
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import Selection from "@simonwep/selection-js";
import Artboard from "./Artboard";
import WelcomeScreen from "./WelcomeScreen";

export default {
  name: "Artboards",
  components: {
    Artboard,
    WelcomeScreen
  },
  data() {
    return {
      selectionInstance: null
    };
  },
  computed: {
    ...mapState({
      artboards: state => state.artboards.list,
      selectedArtboards: state => state.selectedArtboards
    }),
    ...mapGetters("interactions", ["isInteracting"])
  },
  mounted() {
    this.selectionInstance = new Selection({
      class: "selection-area", // Class for the selection-area
      selectedClass: "is-selected",
      selectables: ["#artboards > .artboard"], // All elements in this container can be selected
      boundaries: ["#canvas"], // The boundary
      singleClick: true // Enable single-click selection
    })
      .on("beforestart", evt => {
        // Prevent selections if the user is interacting with an artboard
        if (this.isInteracting) return false;
      })
      .on("start", evt => {
        // Every non-ctrlKey causes a selection reset
        if (!evt.ctrlKey) {
          this.$store.dispatch("selectedArtboards/selectedArtboardsEmpty");
        }

        // Update state
        this.$store.commit("interactions/interactionSetState", {
          key: "isSelectingArea",
          value: true
        });
      })
      .on("move", evt => {
        /**
         * Only add / remove selected class to increase selection performance.
         */

        // Add
        evt.changed.added.forEach(item => {
          const id = item.getAttribute("artboard-id");
          this.$store.dispatch("selectedArtboards/selectedArtboardsAdd", id);
        });

        // Remove
        evt.changed.removed.forEach(item => {
          const id = item.getAttribute("artboard-id");
          this.$store.dispatch("selectedArtboards/selectedArtboardsRemove", id);
        });
      })
      .on("stop", evt => {
        /**
         * Every element has a artboard-id property which is used
         * to find the selected nodes. Find these and append they
         * to the current selection.
         */
        // Remove all in case temporarily added
        this.$store.dispatch("selectedArtboards/selectedArtboardsEmpty");

        // Update state
        this.$store.commit("interactions/interactionSetState", {
          key: "isSelectingArea",
          value: false
        });

        // Push the new IDs
        evt.selected.forEach(item => {
          const id = item.getAttribute("artboard-id");
          this.$store.dispatch("selectedArtboards/selectedArtboardsAdd", id); // Add these items to the Store
        });
      });
  },
  watch: {
    artboards: function() {
      document.$panzoom.center();
    }
  },
  methods: {
    resize(artboard) {
      this.$store.commit("artboards/resizeArtboard", artboard);
    }
  },
  beforeDestroy() {
    this.selectionInstance.destroy();
  }
};
</script>


<style lang="scss">
// WARNING: UNSCOPED!
.selection-area {
  border: 1px solid #cbcbcb;
  background: rgba(198, 198, 198, 0.3);
}
</style>

<style lang="scss" scoped>
#artboards {
  position: relative;
  display: inline-flex;
  flex-direction: row;
  flex-wrap: nowrap;
  user-select: none;
  box-sizing: border-box;
  will-change: auto; // Activate GPU rendering
  z-index: 0;
  // border: 2px solid green;

  &.is-vertical {
    flex-direction: column;
    align-items: center;
  }
}

.artboard {
  // border: 1px solid red;
}

#sidebar {
  position: fixed;
  top: 100;
}
</style>
