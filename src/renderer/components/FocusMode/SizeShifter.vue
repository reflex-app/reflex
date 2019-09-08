<template>
  <div class="size-shifter-container">
    <div
      v-for="(item, index) in focusModeScreens"
      :key="item.id"
      :screen-id="item.id"
      class="size-shifter-item"
      :class="{ 'is-active' : item.id === focusModeActiveScreen.id }"
      @click="changeSize(item.id)"
    >
      <div class="title">⌘{{index+1}}</div>
      <div class="size">{{item.width}}, {{item.height}}</div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      focusModeActiveScreen: state => state.focusMode.activeScreen,
      focusModeScreens: state => state.focusMode.screens
    })
  },
  mounted() {
    this.enableListeners();
  },
  methods: {
    changeSize(id) {
      this.$store.commit("focusChangeActiveScreen", id);
    },
    getIdFromIndex(index) {
      // 0-indexed
      const item = document.querySelectorAll(`[screen-id]`)[index-1]
      const id = item.getAttribute("screen-id");
      return id
    },
    enableListeners() {
      window.addEventListener("keydown", this.keyupHandler);
    },
    keyupHandler(event) {
      const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9];

      // If Control or Command key is pressed and a key is pressed
      // run function
      if ((event.ctrlKey || event.metaKey) && keys.some(key => key == event.key)) {
        // Switch to that artboard
        const id = this.getIdFromIndex(event.key)
        this.changeSize(id)

        // event.preventDefault();
        // return false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.size-shifter-container {
  display: flex;
  overflow: hidden;
  width: 100%;
  background: #e0e0e0;
  border-radius: 30px;
  margin: 0.5rem 1rem;
  user-select: none;
}

.size-shifter-item {
  padding: 0.25rem 1.5rem;
  font-size: 80%;
  border: 1px solid transparent;
  border-radius: 30px;
  cursor: pointer;

  &.is-active {
    background: white;
    border: 1px solid #858585;
  }
}
</style>