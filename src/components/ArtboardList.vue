<template>
  <transition name="sidebar-transition">
    <div id="artboard-tabs" v-if="sidebar==true">
      <div class="artboard-tabs__header">Sizes</div>
      <div v-for="artboard in artboards" v-bind="artboard" :key="artboard.id" class="artboard-tab">
        <div v-if="editMode==true&&editID==artboard.id" class="editing">
          <input type="text" placeholder="Title" ref="input" v-model.lazy="artboard.title">
          <input type="number" placeholder="Width" v-model.number.lazy="artboard.width">
          <input type="number" placeholder="Height" v-model.number.lazy="artboard.height">
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
      <NewArtboardButton class="artboard-tabs__button" @add="add"/>
    </div>
  </transition>
</template>

<script>
import NewArtboardButton from "./NewArtboardButton";

export default {
  name: "ArtboardList",
  components: {
    NewArtboardButton
  },

  data() {
    return {
      editMode: false,
      editID: null
    };
  },

  computed: {
    // Bind to our Vuex Store's URL value
    artboards: function() {
      return this.$store.state.artboards;
    },
    sidebar() {
      return this.$store.state.gui.sidebar;
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
@import "../scss/_variables";

// Animation:Enter
.sidebar-transition-enter {
  transform: translateX(20%);
  opacity: 0;
  z-index: 1;
}
.sidebar-transition-enter-to {
  transform: translateX(0);
  opacity: 1;
}

.sidebar-transition-leave {
  transform: translateX(60%);
  z-index: 1;
}

.sidebar-transition-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

// Animation:Settings
.sidebar-transition-enter-active {
  transition: all 200ms cubic-bezier(0.250, 0.460, 0.450, 0.940), opacity 200ms;
}
.sidebar-transition-leave-active {
  transition: all 150ms cubic-bezier(0.550, 0.085, 0.680, 0.530), opacity 150ms;
}

#artboard-tabs {
  display: flex;
  flex-direction: column;

  // Fixed
  // position: relative;
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  border-left: 1px solid $border-color;

  // Absolute
  // position: absolute;
  // top: 1rem;
  // right: 1rem;
  // border-radius: 4px;
  // border: 1px solid $border-color;
  // max-height: 80%;

  max-width: 18rem;
  min-width: 14rem;
  background: white;
  z-index: 1;
  overflow: auto;
  cursor: default;

  .artboard-tabs__header {
    padding: 1rem 1rem;
    font-size: 1rem;
    font-weight: bold;
  }

  .artboard-tabs__button {
    margin: 1rem 1rem;
    box-sizing: border-box;
    width: auto;
    border-radius: 4px;
  }

  .artboard-tab {
    // flex: 1 0 auto;
    height: auto;
    background: #ffffff;
    padding-left: 1rem;
    padding-right: 1rem;
    font-size: 0.9rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.5;

    &:nth-child(2) {
      border-top: 1px solid $border-color;
    }

    &:not(:last-child) {
      border-bottom: 1px solid $border-color;
    }

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

      // Show the Edit/Delete controls on hover
      &:hover {
        .artboard-tab__container-right {
          display: inline-block;
        }
      }

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
        display: none;
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
}
</style>
