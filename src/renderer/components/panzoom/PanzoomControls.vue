<template>
  <div class="panzoom-controls">
    <div @click="zoomIn">+</div>
    <div @click="zoomOut">-</div>
    <div @click="reset">Reset</div>
  </div>
</template>

<script>
export default {
  props: {
    instance: {
      type: Object,
      required: true
    }
  },
  methods: {
    zoomIn() {
      this.instance.zoomIn();
    },
    zoomOut() {
      this.instance.zoomOut();
    },
    reset() {
      this.instance.reset();
    }
  }
};
</script>

<style lang="scss" scoped>
.panzoom-controls {
  display: flex;
  position: absolute;
  right: 0;
  background: white;
  border-left: 1px solid rgba(black, 0.1);
  border-bottom: 1px solid rgba(black, 0.1);
  font-size: 1rem;
  z-index: 1;

  & > * {
    padding: 1rem 1.5rem;

    &:hover {
      cursor: pointer;
    }

    &:active {
      background: #c5c5c5;
    }
  }

  // Add spacing to each item
  & > *:not(:last-child) {
    // margin-right: 1rem;
  }
}
</style>