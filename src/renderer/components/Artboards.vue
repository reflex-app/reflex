<template>
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
  <div v-else class="empty-state">
    <img src="@/assets/ftu-vector.svg" class="empty-state__image" alt="Welcome graphic" />
    <span class="empty-state__title">Welcome to {{ appName }}</span>
    <p class="empty-state__body">You can create new screens in the Screens panel on the left.</p>
  </div>
</template>

<script>
import { remote } from "electron";
const { Menu, MenuItem } = remote;
import Artboard from "./Artboard";
import { mapState } from "vuex";
import Selection from "@simonwep/selection-js";
import store from "@/store";

export default {
  name: "Artboards",
  components: {
    Artboard
  },
  data() {
    return {
      selectionInstance: null
    };
  },
  computed: {
    ...mapState({
      artboards: state => state.artboards,
      selectedArtboards: state => state.selectedArtboards,
      isPanning: state => state.interactions.isPanning,
      isZooming: state => state.interactions.isZooming,
      isResizingArtboard: state => state.interactions.isResizingArtboard
    }),
    appName() {
      // Return the name of the Electron app
      // From package.json (name or productName)
      return remote.app.getName();
    }
  },
  mounted() {
    const vm = this;

    const selectionInstance = new Selection({
      class: "selection-area", // Class for the selection-area
      selectedClass: "is-selected",
      selectables: ["#artboards > .artboard"], // All elements in this container can be selected
      boundaries: ["#canvas"], // The boundary
      singleClick: true // Enable single-click selection
    });

    selectionInstance
      .on("beforestart", evt => {
        // Prevent selections if the user is interacting with an artboard
        // console.log(vm.isPanning, vm.isResizingArtboard);

        if (
          vm.isPanning === true ||
          vm.isZooming === true ||
          vm.isResizingArtboard === true
        ) {
          return false;
        } else {
          return true;
        }
      })
      .on("start", evt => {
        // Every non-ctrlKey causes a selection reset
        if (!evt.ctrlKey) {
          store.dispatch("selectedArtboardsEmpty");
        }
      })
      .on("move", evt => {
        /**
         * Only add / remove selected class to increase selection performance.
         */

        // Add
        evt.changed.added.forEach(item => {
          const id = item.getAttribute("artboard-id");
          store.dispatch("selectedArtboardsAdd", id);
        });

        // Remove
        evt.changed.removed.forEach(item => {
          const id = item.getAttribute("artboard-id");
          store.dispatch("selectedArtboardsRemove", id);
        });
      })
      .on("stop", evt => {
        /**
         * Every element has a artboard-id property which is used
         * to find the selected nodes. Find these and append they
         * to the current selection.
         */
        // Remove all in case temporarily added
        store.dispatch("selectedArtboardsEmpty");

        // Push the new IDs
        evt.selected.forEach(item => {
          const id = item.getAttribute("artboard-id");
          store.dispatch("selectedArtboardsAdd", id); // Add these items to the Store
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
      this.$store.commit("resizeArtboard", artboard);
    },
    disableSelection() {
      this.selectionInstance.disable();
    },
    enableSelection() {
      this.selectionInstance.enable();
    }
  }
};
</script>


<style lang="scss">
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
