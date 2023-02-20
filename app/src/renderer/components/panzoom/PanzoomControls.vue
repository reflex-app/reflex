<template>
  <div class="panzoom-controls">
    <template v-if="state.enabled">
      <div @click="zoomOut">-</div>
      <div @click="zoomIn">+</div>
      <div @click="reset">Reset</div>
    </template>
    <!-- <SwitchButton :value="true" label="Canvas" @onToggle="toggleCanvas" /> -->
    <!-- {{ currentContext }} -->
  </div>
</template>

<script setup lang="ts">
import SwitchButton from '@/components/Shared/Switch.vue'
import { computed, reactive, defineProps } from 'vue'
import { useInteractionStore } from '~/store/interactions'

const interactions = useInteractionStore()

const props = defineProps({
  instance: {
    type: Object,
    required: true,
  },
})

const data = reactive({
  interactions: computed(() => interactions.currentContext),
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

// /**
//  * Toggles the canvas
//  * When on, users can pan and zoom
//  * When off, users can only interact inside of Screens
//  */
// toggleCanvas(state) {
//   // Update local state
//   this.enabled = state

//   // Update Store
//   this.$store.commit('interactions/setPanzoomState', {
//     value: state,
//   })
// },
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
