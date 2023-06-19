<template>
  <div id="site-tree-container" v-show="isVisible">
    <div class="h-max max-h-screen max-w-3xl w-full bg-white overflow-auto">
      <h1 class="text-4xl mb-4">Sites</h1>
      <p>
        Add your websites and pages below to keep track of progress per-page,
        and easily navigate between pages.
      </p>
      <Tree />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGuiStore } from '~/store/gui'
import Tree from './childUrl.vue'

const gui = useGuiStore()
const isVisible = computed(() => gui.siteTree)
</script>

<style scoped lang="scss">
@import '~/scss/_variables';

#site-tree-container {
  min-height: calc(100vh - #{$gui-title-bar-height});
  border-left: 1px solid $border-color;
  @apply absolute z-10 top-0 right-0 bg-white w-[650px] h-full flex flex-wrap p-4;
  // @apply absolute z-[1000] top-0 left-0 bg-white/80 w-full h-full flex flex-wrap place-content-center;
}
</style>
