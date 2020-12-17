<template>
  <div>
    <div class="absolute-box">
      <!-- Loading -->
      <div v-if="state.isLoading" class="cbs__loading">Loading...</div>
      <!-- Displays the currently running browsers -->
      <div v-if="browserContexts.active.length">
        <div v-for="item in browserContexts.active" :key="item.id">
          {{ item.type }} | {{ item.id }}
        </div>
      </div>
      <!-- Trigger -->
      <button
        v-if="!state.isLoading"
        class="cbs__button"
        @click="emit('clicked')"
      >
        Screenshot other browsers
      </button>
    </div>
  </div>
</template>

<script>
// import { reactive, toRefs } from '@vue/composition-api'
import useCrossBrowserScreenshots from './UseCrossBrowserScreenshots'
import { browserContexts } from '~/components/CrossBrowser/Screenshots'

export default {
  props: {
    data: {
      type: Object,
    },
  },
  setup(props, { emit, root: { $store } }) {
    const { state } = useCrossBrowserScreenshots()

    return {
      emit,
      props,
      state,
      browserContexts,
    }
  },
}
</script>

<style lang="scss" scoped>
.absolute-box {
  position: absolute;
  top: -4rem;
}
</style>
