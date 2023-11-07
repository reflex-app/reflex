<template>
  <div class="h-full w-full">
    <Artboard id="123" :height="height" :width="width" :hide-chrome="true" :webcontext-active-override="true" />
  </div>
</template>

<script setup lang="ts">
import Artboard from './Screens/Artboard.vue';

// The height and width should be 100% viewport even when resized
const height = ref(0) // TODO: Need to subtract the height of the header
const width = ref(0)

// Get the height and width of the viewport
onMounted(() => {
  height.value = window.innerHeight
  width.value = window.innerWidth
})

// Resize the viewport when the window is resized
onMounted(() => {
  window.addEventListener('resize', () => {
    height.value = window.innerHeight
    width.value = window.innerWidth
  })
})
</script>

<style scoped></style>