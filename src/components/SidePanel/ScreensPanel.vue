<template>
  <transition name="sidebar-transition">
    <div id="artboard-tabs">
      <div v-if="artboards.length" class="artboard-tabs__scroll">
        <draggable v-model="artboards" :options="{draggable:'.artboard-tab'}">
          <div
            v-for="artboard in artboards"
            v-bind="artboard"
            :key="artboard.id"
            class="artboard-tab"
          >
            <div v-if="editMode==true&&editID==artboard.id" class="editing">
              <input type="text" placeholder="Title" ref="input" v-model.lazy="artboard.title" @keyup.enter="save(artboard), editMode=false">
              <input type="number" placeholder="Width" v-model.number.lazy="artboard.width" @keyup.enter="save(artboard), editMode=false">
              <input type="number" placeholder="Height" v-model.number.lazy="artboard.height" @keyup.enter="save(artboard), editMode=false">
              <div class="buttons">
                <a href="#" @click="editMode=false">Cancel</a>
                <a href="#" @click="save(artboard)">Save</a>
              </div>
            </div>
            <div class="artboard-tab__container" v-else>
              <div class="artboard-tab__container-left">
                <div>{{artboard.title}}</div>
                <div>{{ artboard.width }} x {{ artboard.height }}</div>
              </div>
              <div class="artboard-tab__container-right">
                <a href="#" @click="edit(artboard.id)">Edit</a> |
                <a href="#" @click="remove(artboard.id)">Delete</a>
              </div>
            </div>
          </div>
        </draggable>
      </div>
      <NewArtboardButton class="artboard-tabs__button" @add="add"/>

      <!-- Show a tip if there's no artboards -->
      <div v-if="!artboards.length" class="empty-state">
        <div class="empty-state__text">Click to create a new screen</div>
      </div>
    </div>
  </transition>
</template>

<script>
import NewArtboardButton from "../NewArtboardButton";
import draggable from "vuedraggable";

export default {
  name: "ScreensPanel",
  components: {
    NewArtboardButton,
    draggable
  },

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
    add() {
      this.$store.commit("addArtboard", {
        title: "Untitled",
        width: 375, // Default
        height: 667 // Default
      });
    },
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
      });
    },
    remove(id) {
      this.$store.commit("removeArtboard", id);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../scss/_variables";

#artboard-tabs {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: auto;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;

  .artboard-tabs__scroll {
    flex-grow: 1;
    min-height: 0;
    overflow: auto;
  }

  .artboard-tabs__button {
    position: relative;
    margin: 1rem 1rem;
    box-sizing: border-box;
    border-radius: 4px;
    width: auto;
  }

  .artboard-tab {
    flex: 1 0 auto;
    background: #ffffff;
    padding-left: 1rem;
    padding-right: 1rem;
    font-size: 0.9rem;
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
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
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
      }
    }

    .editing {
      display: flex;
      flex-direction: column;
      padding-top: 1rem;
      padding-bottom: 1rem;

      .buttons {
        display: flex;
        justify-content: space-between;
        margin: 0.5rem 0 0;
      }

      input[type="text"],
      input[type="number"] {
        border: none;
        border-bottom: 1px solid $border-color;
        font-size: 0.9rem;
        background: none;
        width: auto;
        padding: 0.5rem 0.5rem;
        outline: none;

        &:not(:last-child) {
          margin-bottom: 4px;
        }

        &:hover {
          background: white;
          box-shadow: 0 0px 0px 1px #cbcbcb;
        }

        &:focus {
          border-radius: 2px;
          box-shadow: 0 0px 0px 1px $accent-color,
            0 4px 10px 2px rgba($accent-color, 0.2);
          color: $accent-color;
          background: white;
        }
      }
    }
  }

  .empty-state {
    background: #535353;
    border: 1px solid #434343;
    box-shadow: 0 1px 4px 0 rgba(102, 102, 102, 0.5);
    border-radius: 4px;
    margin: 0 1rem;
    user-select: none;
    position: relative;
    animation: MoveUpDown 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;

    @keyframes MoveUpDown {
      0%,
      100% {
        bottom: 0;
      }
      50% {
        bottom: 8px;
      }
    }

    // Triangle
    &:after {
      content: "";
      position: absolute;
      top: -6px;
      left: 0.5rem;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 0px 6px 6px 6px;
      // border-width: 6px 6px 0 6px;
      border-color: transparent transparent #535353 transparent;
      // border-color: #535353 transparent transparent transparent;
    }

    .empty-state__text {
      padding: 0.5rem;
      font-size: 0.8rem;
      line-height: 1.5;
      color: white;
    }
  }
}
</style>
