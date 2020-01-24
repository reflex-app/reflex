<template>
  <div class="controls">
    <Button
      role="ghost"
      :rounded="true"
      :tight="true"
      v-if="canGoBack"
      @click="back"
      icon="arrow-left"
      title="Back"
    ></Button>
    <Button
      role="ghost"
      :rounded="true"
      :tight="true"
      v-if="canGoForward"
      @click="forward"
      icon="arrow-right"
      title="Forward"
    ></Button>
    <Button
      role="ghost"
      :rounded="true"
      :tight="true"
      @click="reload"
      icon="reload"
      title="Forward"
    ></Button>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      pages: state => state.history.pages,
      currentPage: state => state.history.currentPage.index,
      history: state => state.history
    }),
    canGoBack() {
      return this.checkHistory("back");
    },
    canGoForward() {
      return this.checkHistory("forward");
    }
  },
  methods: {
    ...mapActions("history", ["reload", "forward", "back"]),
    checkHistory(direction) {
      if (!direction || !this.pages) throw new Error("Missing inputs");

      let nextPageIndex;

      switch (direction) {
        case "back":
          nextPageIndex = this.pages[this.currentPage - 1];
          break;

        case "forward":
          nextPageIndex = this.pages[this.currentPage + 1];
          break;
      }

      if (
        this.pages.length > 0 &&
        this.currentPage !== nextPageIndex &&
        typeof nextPageIndex !== "undefined"
      ) {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.controls {
  display: flex;
  margin-right: 1rem;
}
</style>