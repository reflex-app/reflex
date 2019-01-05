<template>
  <div id="artboard-tabs">
    <div v-for="artboard in artboards" v-bind="artboard" class="artboard-tab" :key="artboard.id">
      <div v-if="editMode==true&&editID==artboard.id" class="editing">
        <input type="text" v-model.lazy="artboard.title">
        <input type="text" v-model.lazy="artboard.width">
        <input type="text" v-model.lazy="artboard.height">
        <a href="#" @click="editMode=false">Done</a>
      </div>
      <div v-else>
        <div>{{artboard.title}}</div>
        <div>{{ artboard.width }} x {{ artboard.height }}</div>
        <div>
          <a href="#" @click="edit(artboard.id)">Edit</a> |
          <a href="#" @click="remove(artboard.id)">Delete</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ArtboardList",
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
    }
  },
  methods: {
    edit(id) {
      this.editMode = true;
      this.editID = id;
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

  .artboard-tab {
    flex: 1 0 auto;
    height: auto;
    background: #ffffff;
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
    white-space: nowrap;
    max-width: 6rem;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
    line-height: 1.5;

    &:not(:last-child) {
      // margin-bottom: 0.25rem;
      border-bottom: 1px solid $border-color;
    }

    &:hover {
      background: #f1f1f1;
    }

    &:active {
      background: #e2e2e2;
    }

    .editing {
      display: flex;
      flex-direction: column;

      input[type="text"] {
        border: none;
        border-bottom: 1px solid $border-color;
        font-size: 1rem;
        background: none;
        width: auto;

        &:not(:last-child) {
          margin-bottom: 4px;
        }
      }
    }
  }
}
</style>
