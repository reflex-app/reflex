<template>
  <div id="artboards">
    <Artboard
      v-bind="artboardData"
      :artboard-id="1"
      :selectedItems="selectedArtboards"
      ref="artboard"
      class="artboard"
      @resize="resize"
    />
  </div>
</template>

<script>
import { remote } from "electron";
import { mapState, mapGetters } from "vuex";
import Selection from "@simonwep/selection-js";
import Artboard from "./Artboard";

export default {
  name: "Artboards",
  components: {
    Artboard
  },
  data() {
    return {
      selectionInstance: null,
      artboardData: {
        title: 'Test',
        height: 600,
        width: 360
      }
    };
  },
  computed: {
    ...mapState({
      artboards: state => state.artboards,
      selectedArtboards: state => state.selectedArtboards
    }),
    ...mapGetters(["isInteracting"]),
    appName() {
      // Return the name of the Electron app
      // From package.json (name or productName)
      // TODO this if check is required in case of tests
      if (remote) {
        return remote.app.getName();
      } else {
        const pkgJson = require("../../../../package.json");
        return pkgJson.productName;
      }
    }
  },
  mounted() {
    const vm = this;

    this.selectionInstance = new Selection({
      class: "selection-area", // Class for the selection-area
      selectedClass: "is-selected",
      selectables: ["#artboards > .artboard"], // All elements in this container can be selected
      boundaries: ["#canvas"], // The boundary
      singleClick: true // Enable single-click selection
    });

    this.selectionInstance
      .on("beforestart", evt => {
        // Prevent selections if the user is interacting with an artboard
        if (this.isInteracting) return false;
      })
      .on("start", evt => {
        // Every non-ctrlKey causes a selection reset
        if (!evt.ctrlKey) {
          this.$store.dispatch("selectedArtboardsEmpty");
        }

        // Update state
        this.$store.commit("interactionSetState", {
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
          this.$store.dispatch("selectedArtboardsAdd", id);
        });

        // Remove
        evt.changed.removed.forEach(item => {
          const id = item.getAttribute("artboard-id");
          this.$store.dispatch("selectedArtboardsRemove", id);
        });
      })
      .on("stop", evt => {
        /**
         * Every element has a artboard-id property which is used
         * to find the selected nodes. Find these and append they
         * to the current selection.
         */
        // Remove all in case temporarily added
        this.$store.dispatch("selectedArtboardsEmpty");

        // Update state
        this.$store.commit("interactionSetState", {
          key: "isSelectingArea",
          value: false
        });

        // Push the new IDs
        evt.selected.forEach(item => {
          const id = item.getAttribute("artboard-id");
          this.$store.dispatch("selectedArtboardsAdd", id); // Add these items to the Store
        });
      });
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
