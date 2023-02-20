<template>
  <draggable
    v-model="artboardsGetSet"
    :group="{ name: 'artboards', pull: true, put: true }"
    :animation="150"
    :disabled="editMode === true"
  >
    <div v-for="artboard in artboards" :key="artboard.id" class="artboard-tab">
      <!-- Editing state -->
      <div v-if="editMode == true && editID == artboard.id" class="editing">
        <div class="group">
          <label>Title</label>
          <input
            ref="input"
            v-model="localFormData.title"
            type="text"
            placeholder="Title"
            @keyup.enter="save(artboard), (editMode = false)"
          />
        </div>
        <div class="group group--two-up">
          <label>Dimensions</label>
          <div class="group__two-up">
            <div class="group__input-with-right-label">
              <input
                v-model="localFormData.width"
                type="number"
                placeholder="Width"
                @keyup.enter="save(artboard), (editMode = false)"
              />
              <label>W</label>
            </div>
            <div class="group__input-with-right-label">
              <input
                v-model="localFormData.height"
                type="number"
                placeholder="Height"
                @keyup.enter="save(artboard), (editMode = false)"
              />
              <label>H</label>
            </div>
          </div>

          <div class="buttons">
            <!-- TODO Cancel button doesn't really cancel/undo... -->
            <Button role="secondary" @click="cancelEdit(), (editMode = false)">
              Cancel
            </Button>
            <Button role="primary" @click="save(artboard)">Save</Button>
          </div>
        </div>
      </div>
      <!-- Normal state -->
      <div
        v-else
        class="artboard-tab__container"
        @click="selectArtboard(artboard.id)"
        @mouseover="hoverStart(artboard.id)"
        @mouseout="hoverEnd(artboard.id)"
        @contextmenu="rightClickMenu($event, artboard)"
      >
        <div class="artboard-tab__container-left">
          <div>{{ artboard.title }}</div>
          <div>{{ artboard.width }} x {{ artboard.height }}</div>
        </div>
        <div class="artboard-tab__container-right">
          <div>
            <Icon v-if="artboard.isVisible" name="visible" />
            <Icon v-if="!artboard.isVisible" name="hidden" />
          </div>
          <Button role="secondary" @click="edit(artboard.id)">Edit</Button>
          <!-- <Button
            role="ghost"
            icon="delete"
            @click.stop="remove(artboard.title, artboard.id)"
            title="Delete"
          ></Button>-->
        </div>
      </div>
    </div>
  </draggable>
</template>

<script>
import draggable from 'vuedraggable'
import { mapState } from 'vuex'
import rightClickMenu from '~/mixins/rightClickMenu'

export default {
  name: 'ArtboardEditable',
  components: {
    draggable,
  },
  props: ['data'],
  data() {
    return {
      editMode: false,
      editID: null,
      localFormData: {
        title: '',
        width: 0,
        height: 0,
      },
    }
  },
  computed: {
    ...mapState({
      artboards: (state) => state.artboards.list,
    }),
    artboardsGetSet: {
      get() {
        return this.$store.state.artboards.list
      },
      set(value) {
        this.$store.dispatch('artboards/setArtboards', value)
      },
    },
    artboardVisibility(bool) {
      return bool ? 'visible' : 'hidden'
    },
  },
  methods: {
    save(artboard) {
      // Disable editing mode
      this.editMode = false
      this.editID = null

      // Save to Store
      this.$store.commit('artboards/updateArtboardAtIndex', {
        ...artboard,
        width: Number(this.localFormData.width),
        height: Number(this.localFormData.height),
        title: this.localFormData.title,
      })
    },
    edit(id) {
      // Udpate the state
      this.editMode = true
      this.editID = id

      // Fill in the latest data
      const currentArtboard = () => {
        const obj = this.artboards.find((artboard) => artboard.id === id)
        // Return a clone of the Store object
        return JSON.parse(JSON.stringify(obj))
      }

      // Update the local form data
      this.localFormData = currentArtboard()

      // Auto-focus on the first field
      this.$nextTick(() => {
        this.$refs.input[0].focus()
        this.$refs.input[0].select()
      })
    },
    cancelEdit() {
      // Reset to Vuex store state
      this.localFormData = this.artboards
    },
    remove(name, id) {
      // TODO Custom prompts?
      if (
        confirm(
          `Are you sure you want to delete the ${name} screen size? Click "OK" to delete.`
        )
      ) {
        this.$store.commit('artboards/removeArtboard', id)
      }
    },
    goToArtboard(id) {
      // Find the artboard (DOM)
      const artboard = document.querySelector(`[artboard-id="${id}"]`)

      // Pan to the position of the element relative to the parent
      // TODO factor in the size of the artboard... Panzoom should scale down to fith the screen
      this.$root.$panzoom.pan(-artboard.offsetLeft, artboard.offsetTop)
    },
    rightClickMenu(e, artboard) {
      rightClickMenu(this.$store, {
        title: artboard.title,
        id: artboard.id,
        width: artboard.width,
        height: artboard.height,
        isVisible: artboard.isVisible,
      })
    },
    hoverStart(id) {
      this.$store.dispatch('hoverArtboards/addHover', id)
    },
    hoverEnd(id) {
      this.$store.dispatch('hoverArtboards/removeHover', id)
    },
    selectArtboard(id) {
      // Move screen to the selected artboard
      this.goToArtboard(id)
      // Remove all previous selections
      this.$store.dispatch('selectedArtboards/empty', id)
      // Add the new artboard to selection
      this.$store.dispatch('selectedArtboards/add', id)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/scss/_variables';
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
    background: #f1f1f1;
  }

  &:active {
    background: #e2e2e2;
  }

  .artboard-tab__container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem $artboard-tab-side-padding;
    overflow: auto;
    cursor: pointer;

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

    input[type='text'],
    input[type='number'] {
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
