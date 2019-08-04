<template>
  <div>
    <div class="controls">
      <div class="controls__button" id="history-back" v-if="canGoBack" @click="back" title="Back"></div>
      <div
        class="controls__button"
        id="history-forward"
        v-if="canGoForward"
        @click="forward"
        title="Forward"
      ></div>
      <div class="controls__button" id="history-reload" @click="reload" title="Reload"></div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      pages: state => state.history.pages,
      currentPage: state => state.history.currentPage,
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
    ...mapActions([
      "reload", // map `this.reload()` to `this.$store.dispatch('reload')`
      "forward",
      "back"
    ]),
    checkHistory(direction) {
      if (!direction || !this.pages) throw new Error("Missing inputs");
      console.log("computed count is called");

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

  & > * {
    position: relative;
    height: 1.5rem;
    width: 1.5rem;
  }

  & > *:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-size: 90%;
    background-repeat: no-repeat;
    background-position: center;
  }
}

.controls__button {
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  transition: background 125ms ease-out;

  &:hover {
    background: rgb(211, 211, 211);
  }
}

#history-back:after {
  background-image: url("~@/assets/icons/arrow-left.svg");
}
#history-forward:after {
  background-image: url("~@/assets/icons/arrow-right.svg");
}
#history-reload:after {
  background-image: url("~@/assets/icons/reload.svg");
}
</style>