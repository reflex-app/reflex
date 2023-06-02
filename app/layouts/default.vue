<template>
  <div class="app-container">
    <ToolBar />
    <slot />
  </div>
</template>

<script setup lang="ts">
import isElectron from 'is-electron';
import ToolBar from '@/components/ToolBar/index.vue';
import { ipcRenderer } from 'electron';

onMounted(() => {
  if (isElectron()) {
    ipcRenderer.on('menu_reset-app', () => {
      if (
        confirm(
          `Are you sure you want to reset all data and settings? Click "OK" to reset.`
        )
      ) {
        window.localStorage.clear();

        setTimeout(() => {
          ipcRenderer.invoke('reload-window');
        }, 150);
      }
    });
  }
});


</script>


<style lang="scss" scoped>
.app-container {
  height: 100%;
  width: 100%;
}
</style>
