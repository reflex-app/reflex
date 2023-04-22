<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>


<script setup lang="ts">
import { useIconStore } from "@/store/icons";
const icons = useIconStore();

// Get the icons
await icons.fetchIcons();
</script>

<style lang="scss">
@import "@/scss/global.scss";
</style>