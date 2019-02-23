<template>
  <transition name="sidebar-transition">
    <div id="artboard-tabs">
      <div v-if="artboards.length" class="artboard-tabs__scroll">
        <draggable v-model="artboards" :options="{draggable:'.artboard-tab'}">
          <div
            v-for="artboard in artboards"
            :key="artboard.id"
            v-bind="artboard"
            class="artboard-tab"
          >
            <div v-if="editMode==true&&editID==artboard.id" class="editing">
              <div class="group">
                <label>Title</label>
                <input
                  ref="input"
                  v-model.lazy="artboard.title"
                  type="text"
                  placeholder="Title"
                  @keyup.enter="save(artboard), editMode=false"
                >
              </div>
              <div class="group">
                <label>Dimensions</label>
                <div class="group__input-with-right-label">
                  <input
                    v-model.number.lazy="artboard.width"
                    type="number"
                    placeholder="Width"
                    @keyup.enter="save(artboard), editMode=false"
                  >
                  <label>W</label>
                </div>
                <div class="group__input-with-right-label">
                  <input
                    v-model.number.lazy="artboard.height"
                    type="number"
                    placeholder="Height"
                    @keyup.enter="save(artboard), editMode=false"
                  >
                  <label>H</label>
                </div>

                <div class="buttons">
                  <a href="#" @click="editMode=false">Cancel</a>
                  <a href="#" @click="save(artboard)">Save</a>
                </div>
              </div>
            </div>
            <div v-else class="artboard-tab__container">
              <div class="artboard-tab__container-left">
                <div>{{ artboard.title }}</div>
                <div>{{ artboard.width }} x {{ artboard.height }}</div>
              </div>
              <div class="artboard-tab__container-right">
                <a href="#" @click="edit(artboard.id)">Edit</a>
                <a href="#" @click="remove(artboard.id)">&times;</a>
              </div>
            </div>
          </div>
        </draggable>
      </div>

      <div class="artboard-tabs__button button button--primary" @click="add()">New Screen</div>

      <!-- Show a tip if there's no artboards -->
      <div v-if="!artboards.length" class="empty-state">
        <div class="empty-state__text">Click to create a new screen</div>
      </div>

      <div class="panel-section">
        <span>Add from template:</span>
        <select v-model="defaultSizeSelection" @change="addDefaultSizes">
          <option disabled value>Select template...</option>
          <option value="basic">Basic</option>
          <option value="bootstrap">Bootstrap 4</option>
          <option value="foundation">Foundation 6</option>
        </select>
      </div>
    </div>
  </transition>
</template>

<script>
import draggable from "vuedraggable";

export default {
  name: "ScreensPanel",
  components: {
    draggable
  },

  data() {
    return {
      editMode: false,
      editID: null,
      defaultSizeSelection: ""
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
      this.$store.dispatch("addArtboard", {
        title: "Untitled",
        width: 375,
        height: 667
      });
    },
    addDefaultSizes() {
      if (!this.defaultSizeSelection) return false;

      let sizes; // This will contain the size data

      const defaults = {
        small: {
          title: "Small",
          width: 375,
          height: 667
        },
        medium: {
          title: "Medium",
          width: 768,
          height: 1024
        },
        large: {
          title: "Large",
          width: 1024,
          height: 720
        }
      };

      const bootstrap = {
        xsmall: {
          title: "XS",
          width: 375,
          height: 500
        },
        small: {
          title: "S",
          width: 576,
          height: 800
        },
        medium: {
          title: "M",
          width: 768,
          height: 1000
        },
        large: {
          title: "MD",
          width: 992,
          height: 1200
        },
        xlarge: {
          title: "LG",
          width: 1200,
          height: 1400
        }
      };

      const foundation = {
        small: {
          title: "Small",
          width: 400,
          height: 600
        },
        medium: {
          title: "Medium",
          width: 640,
          height: 800
        },
        large: {
          title: "Large",
          width: 1024,
          height: 1200
        }
      };

      switch (this.defaultSizeSelection) {
        case "basic":
          sizes = defaults;
          break;
        case "bootstrap":
          sizes = bootstrap;
          break;
        case "foundation":
          sizes = foundation;
          break;
      }

      this.$store.dispatch("addMultipleArtboards", {
        data: sizes
      });

      // Empty selected value
      this.defaultSizeSelection = "";
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
        this.$refs.input[0].select();
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
