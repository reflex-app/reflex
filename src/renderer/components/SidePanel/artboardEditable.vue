<template>
  <draggable v-model="artboards" :animation="150">
    <div v-for="artboard in artboards" v-bind="artboard" :key="artboard.id" class="artboard-tab">
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
        <div class="group group--two-up">
          <label>Dimensions</label>
          <div class="group__two-up">
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
          </div>

          <div class="buttons">
            <!-- TODO Cancel button doesn't really cancel/undo... -->
            <Button role="secondary" @click="editMode=false">Cancel</Button>
            <Button role="primary" @click="save(artboard)">Save</Button>
          </div>
        </div>
      </div>
      <!-- Normal state -->
      <div
        v-else
        class="artboard-tab__container"
        @contextmenu="rightClickMenu($event, artboard)"
      >
        <div class="artboard-tab__container-left" @click="goToArtboard(artboard.id)">
          <div>{{ artboard.title }}</div>
          <div>{{ artboard.width }} x {{ artboard.height }}</div>
        </div>
        <div class="artboard-tab__container-right">
          <Button role="secondary" @click="edit(artboard.id)">Edit</Button>
          <Button
            role="ghost"
            icon="delete"
            @click="remove(artboard.title, artboard.id)"
            title="Delete"
          ></Button>
        </div>
      </div>
    </div>
  </draggable>
</template>

<script>
import { remote } from "electron";
import draggable from "vuedraggable";
import isElectron from "is-electron";
const { Menu, MenuItem } = remote;

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
    remove(name, id) {
      // TODO Custom prompts?
      if (
        confirm(
          `You are able to to delete the ${name} screen size. Click "OK" to delete.`
        )
      ) {
        this.$store.commit("removeArtboard", id);
      }
    },
    goToArtboard(id) {
      // Find the artboard (DOM)
      const artboard = this.getArtboard(id);
      // Move the panzoom container
      document.$panzoom.panToElement(artboard);
    },
    rightClickMenu(e, artboard) {
      // Open the DevTools for x screen ID
      // TODO using brittle selectors
      // const artboard = this.getArtboard(artboard.id);
      const vm = this
      const artboardFrame = this.getArtboard(artboard.id).querySelector("webview");

      if (artboardFrame) {
        if (isElectron()) {
          const menu = new Menu();
          menu.append(
            new MenuItem({
              label: "Duplicate",
              click() {
                vm.$store.dispatch("duplicateArtboard", artboard);
              }
            })
          );
          menu.append(
            new MenuItem({
              label: "Open DevTools",
              click() {
                artboardFrame.openDevTools();
              }
            })
          );
          menu.popup(remote.getCurrentWindow());
        }
      } else {
        throw new Error("No frame near artboard");
      }
    },
    getArtboard(id) {
      // TODO add test here, selectors are brittle
      // This could probably be a Store action
      return document.querySelector(`[artboard-id="${id}"]`);
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
      cursor: pointer;

      & > * {
        text-overflow: ellipsis;
        overflow: hidden;
      }

      & > *:nth-child(2) {
        color: gray;
      }
    }

    .artboard-tab__container-right {
      display: flex;
      margin-left: 20px;

      // Add space between Edit & Delete links
      & > *:not(:last-child) {
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
      margin: 1rem 0 0;

      & > *:not(:last-child) {
        margin-right: 0.5rem;
      }
    }

    .group {
      display: flex;
      flex-direction: column;

      &:not(:first-child) {
        margin-top: 1rem;
      }
    }

    .group__two-up {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-column-gap: 0.5rem;

      & > * {
        display: block;
        width: 100%;
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