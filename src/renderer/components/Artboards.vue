<template>
  <div v-if="artboards.length" id="artboards" @contextmenu="rightClickMenu($event)">
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
      selectedArtboards: state => state.selectedArtboards
    }),
    artboards() {
      // Returns an array of artboards
      return this.$store.state.artboards;
    },
    appName() {
      // Return the name of the Electron app
      // From package.json (name or productName)
      return remote.app.getName();
    }
  },
  mounted() {
    const vm = this;

    vm.selectionInstance = Selection.create({
      class: "selection-area", // Class for the selection-area
      selectedClass: "is-selected",
      selectables: ["#artboards > .artboard"], // All elements in this container can be selected
      boundaries: ["#canvas"], // The boundary
      singleClick: true, // Enable single-click selection

      // Actions to perform before starting
      // validateStart(evt) {
      //   // TODO Check if panning or zooming
      //   return true; // Return true to start the selection, false to cancel it.
      // },

      //------------------------------------------
      // START
      //------------------------------------------

      // this event is triggered on drag start
      onStart({ originalEvent }) {
        // Every non-ctrlKey causes a selection reset
        if (!originalEvent.ctrlKey) {
        }

        store.dispatch("selectedArtboardsEmpty");
        this.clearSelection();
      },

      //------------------------------------------
      // MOVE
      //------------------------------------------

      // this event is triggered on mouse drag, not move
      onMove({ changedElements }) {
        /**
         * Only add / remove selected class to increase selection performance.
         */

        // Add
        changedElements.added.forEach(item => {
          const id = item.getAttribute("artboard-id");
          store.dispatch("selectedArtboardsAdd", id);
        });

        // Remove
        changedElements.removed.forEach(item => {
          const id = item.getAttribute("artboard-id");
          store.dispatch("selectedArtboardsRemove", id);
        });
      },

      //------------------------------------------
      // SELECT (click)
      //------------------------------------------
      onSelect({ selectedElements }) {
        // Push the new IDs
        selectedElements.forEach(item => {
          const id = item.getAttribute("artboard-id");
          store.dispatch("selectedArtboardsAdd", id); // Add these items to the Store
        });
      },

      //------------------------------------------
      // STOP
      //------------------------------------------

      // this event is triggered on dragend
      onStop({ selectedElements }) {
        /**
         * Every element has a artboard-id property which is used
         * to find the selected nodes. Find these and append they
         * to the current selection.
         */

        // Remove all in case temporarily added
        store.dispatch("selectedArtboardsEmpty");

        // Push the new IDs
        selectedElements.forEach(item => {
          const id = item.getAttribute("artboard-id");
          store.dispatch("selectedArtboardsAdd", id); // Add these items to the Store
        });
      }
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
    rightClickMenu(e) {
      const element = e.target.querySelector(".frame");

      // Only display menu if a <webview> was found near the click
      if (element) {
        const menu = new Menu();
        menu.append(
          new MenuItem({
            label: "Open Inspector",
            click() {
              console.log(element);
              element.openDevTools();
            }
          })
        );

        menu.popup(remote.getCurrentWindow());
      }
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
  background: rgba(0, 0, 255, 0.1);
  border-radius: 0.1em;
  border: 0.05em solid rgba(0, 0, 255, 0.2);
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
