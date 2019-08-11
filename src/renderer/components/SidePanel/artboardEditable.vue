<template>
  <draggable v-model="artboards">
    <div
      v-for="(artboard, index) in artboards"
      :key="artboard.id"
      v-bind="artboard"
      class="artboard-tab"
    >
      <!-- Editing state -->
      <div v-if="editMode==true&&editID==artboard.id" class="editing">
        <div class="group">
          <label>Title</label>
          <input
            ref="input"
            v-model.lazy="artboard.title"
            type="text"
            placeholder="Title"
            @keyup.enter="save(artboard), editMode=false"
          />
        </div>
        <div class="group">
          <label>Dimensions</label>
          <div class="group__input-with-right-label">
            <input
              v-model.number.lazy="artboard.width"
              type="number"
              placeholder="Width"
              @keyup.enter="save(artboard), editMode=false"
            />
            <label>W</label>
          </div>
          <div class="group__input-with-right-label">
            <input
              v-model.number.lazy="artboard.height"
              type="number"
              placeholder="Height"
              @keyup.enter="save(artboard), editMode=false"
            />
            <label>H</label>
          </div>

          <div class="buttons">
            <a href="#" @click="editMode=false">Cancel</a>
            <a href="#" @click="save(artboard)">Save</a>
          </div>
        </div>
      </div>
      <!-- Normal state -->
      <div
        v-else
        class="artboard-tab__container"
        @contextmenu="rightClickMenu($event, artboard.id)"
      >
        <div class="artboard-tab__container-left" @click="goToArtboard(index)">
          <div>{{ artboard.title }}</div>
          <div>{{ artboard.width }} x {{ artboard.height }}</div>
        </div>
        <div class="artboard-tab__container-right">
          <!-- <a href="#" @click="edit(artboard.id)">Inspect</a> -->
          <a href="#" @click="edit(artboard.id)">Edit</a>
          <a href="#" @click="remove(artboard.id)">&times;</a>
        </div>
      </div>
    </div>
  </draggable>
</template>

<script>
import { remote } from "electron";
const { Menu, MenuItem } = remote;
import draggable from "vuedraggable";

export default {
  name: "artboardEditable",
  components: {
    draggable
  },
  props: ["data"],
  data() {
    return {
      editMode: false,
      editID: null
    };
  },
  computed: {
    // Bind to our Vuex Store's URL value
    artboards: {
      get() {
        return this.$store.state.artboards;
      },
      set(value) {
        this.$store.commit("setArtboardList", value);
      }
    }
  },
  methods: {
    save(artboard) {
      // Disable editing mode
      this.editMode = false;
      this.editID = null;

      // Update the values so that VueJS pays attention
      this.$store.commit("updateArtboardAtIndex", {
        id: artboard.id,
        height: artboard.height || 0,
        width: artboard.width || 0,
        title: artboard.title || "Untitled"
      });
    },
    edit(id) {
      this.editMode = true;
      this.editID = id;

      // Auto-focus on the first field
      this.$nextTick(() => {
        this.$refs.input[0].focus();
        this.$refs.input[0].select();
      });
    },
    remove(id) {
      this.$store.commit("removeArtboard", id);
    },
    goToArtboard(id) {
      // Find the artboard (DOM)
      const artboard = document.getElementsByClassName("artboard")[id];

      // Move the panzoom container
      document.$panzoom.scaleToFitEl(artboard);
    },
    rightClickMenu(e, id) {
      // Open the DevTools for x screen ID
      const artboard = document.getElementsByClassName("artboard")[id];
      const artboardFrame = artboard.querySelector(".frame");

      if (artboardFrame) {
        const menu = new Menu();
        menu.append(
          new MenuItem({
            label: "Open DevTools",
            click() {
              // console.log(element);
              artboardFrame.openDevTools();
            }
          })
        );
        menu.popup(remote.getCurrentWindow());
      } else {
        throw new Error("No frame near artboard");
      }

      // const element = e.target.querySelector(".frame");
    }
  }
};
</script>

<style lang='scss' scoped>
@import "~@/scss/_variables";
$artboard-tab-side-padding: 1rem;

.artboard-tab {
  flex: 1 0 auto;
  background: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5;
  border-bottom: 1px solid $border-color;

  &:hover {
    // background: #f1f1f1;
  }

  &:active {
    // background: #e2e2e2;
  }

  .artboard-tab__container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem $artboard-tab-side-padding;
    overflow: auto;

    .artboard-tab__container-left {
      max-width: 9rem;
      min-width: 5rem;
      white-space: nowrap;
      overflow: hidden;
      & > * {
        text-overflow: ellipsis;
        overflow: hidden;
      }

      & > *:nth-child(2) {
        color: gray;
      }
    }

    .artboard-tab__container-right {
      margin-left: 20px;

      // Add space between Edit & Delete links
      a:not(:last-child) {
        margin-right: 8px;
      }
    }
  }

  .editing {
    box-sizing: border-box;
    padding: 1rem $artboard-tab-side-padding;
    background: #f4f4f4;

    .buttons {
      display: flex;
      justify-content: space-between;
      margin: 0.5rem 0 0;
    }

    .group {
      display: flex;
      flex-direction: column;

      &:not(:first-child) {
        margin-top: 1rem;
      }
    }

    label {
      margin-bottom: 0.5rem;
    }

    .group__input-with-right-label {
      display: flex;
      width: 100%;
      position: relative;
      align-items: center;

      input {
        width: 100%;
      }

      label {
        position: absolute;
        top: 0.3rem;
        right: 1.5rem;
        color: gray;
        text-align: right;
      }
    }

    input[type="text"],
    input[type="number"] {
      position: relative;
      border: 1px solid $border-color;
      border-radius: 4px;
      font-size: 0.9rem;
      background: white;
      padding: 0.5rem 0.5rem;
      outline: none;

      &:not(:last-child) {
        margin-bottom: 0.25rem;
      }

      &:hover {
        // background: white;
        // box-shadow: 0 0px 0px 1px #cbcbcb;
      }

      &:focus {
        border-color: $accent-color;
        color: $accent-color;
      }

      & + input {
        margin-top: 4px;
      }
    }
  }
}
</style>