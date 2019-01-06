<template>
  <div id="artboard-tabs">
    <div class="artboard-tabs__header" @click="dropdownOpen=true">Sizes</div>
    <div v-if="dropdownOpen==true">
      <div v-for="artboard in artboards" v-bind="artboard" :key="artboard.id" class="artboard-tab">
        <div v-if="editMode==true&&editID==artboard.id" class="editing">
          <input type="text" ref="input" v-model.lazy="artboard.title">
          <input type="number" v-model.number.lazy="artboard.width">
          <input type="number" v-model.number.lazy="artboard.height">
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
      <NewArtboardButton @add="add"/>
    </div>
  </div>
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
      editID: null,
      dropdownOpen: false
    };
  },

  computed: {
    // Bind to our Vuex Store's URL value
    artboards: function() {
      return this.$store.state.artboards;
    }
  },

  methods: {
    add(artboard) {
      this.$store.commit("addArtboard", {
        title: "Untitled",
        width: 375, // TODO: dynamic
        height: 667 // TODO: dynamic
      });
    },
    save(artboard) {
      // Disable editing mode
      this.editMode = false;
      this.editID = null;

      // Update the values so that VueJS pays attention
      const artboards = this.artboards;

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

#artboard-tabs {
  display: flex;
  flex-direction: column;
  // max-width: 400px;
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: white;
  border: 1px solid $border-color;
  border-radius: 4px;
  z-index: 1;
  overflow: auto;
  max-height: 90%;
  cursor: default;

  .artboard-tabs__header {
    padding: 0.5rem 0.75rem;
    font-size: 1rem;
    line-height: 1.3;
  }

  .artboard-tab {
    flex: 1 0 auto;
    height: auto;
    background: #ffffff;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    font-size: 0.9rem;
    white-space: nowrap;
    max-width: 18rem;
    min-width: 12rem;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.5;
    // cursor: pointer;

    &:first-child {
      border-top: 1px solid $border-color;
    }

    &:not(:last-child) {
      border-bottom: 1px solid $border-color;
    }

    &:hover {
      background: #f1f1f1;
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
          box-shadow: 0 0px 0px 2px $accent-color,
            0 2px 20px 2px rgba($accent-color, 0.3);
          color: $accent-color;
          background: white;
        }
      }
    }
  }
}
</style>
