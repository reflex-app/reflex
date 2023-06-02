<template>
  <div class="container mx-auto">
    <hr class="my-4" />
    <div class="absolute z-[1000] top-0 left-0 bg-white w-full h-full flex flex-wrap place-content-center">
      <div class="h-max max-w-3xl w-full">
        <h1 class="text-4xl mb-4">Sites</h1>
        <Tree />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Tree from './childUrl.vue';
</script>

<style scoped>
/* Add any custom styles here */
</style>
