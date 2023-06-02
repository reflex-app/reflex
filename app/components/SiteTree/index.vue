<template>
  <div v-if="isVisible"
    class="absolute z-[1000] top-0 left-0 bg-white/80 w-full h-full flex flex-wrap place-content-center" @click="close()">
    <div class="h-max max-w-3xl w-full bg-white rounded-lg p-16 shadow-xl" @click.stop>
      <h1 class="text-4xl mb-4">Sites</h1>
      <Tree />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGuiStore } from '~/store/gui'
import Tree from './childUrl.vue';

const gui = useGuiStore()
const isVisible = computed(() => gui.siteTree)

const close = () => {
  gui.toggleGui('siteTree')
}
</script>

<style scoped>
/* Add any custom styles here */
</style>
