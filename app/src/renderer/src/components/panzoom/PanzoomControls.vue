<template>
  <div class="panzoom-controls">
    <template v-if="state.enabled">
      <div @click="zoomOut">-</div>
      <div @click="zoomIn">+</div>
      <div @click="reset">Reset</div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, defineProps } from 'vue'

const props = defineProps({
  instance: {
    type: Object,
    required: true,
  },
})

const state = reactive({
  enabled: true,
})

function zoomIn() {
  props.instance.zoomIn()
}
function zoomOut() {
  props.instance.zoomOut()
}
function reset() {
  props.instance.reset()
}
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
  user-select: none;

  & > * {
    padding: 0.5rem 1.25rem;

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
