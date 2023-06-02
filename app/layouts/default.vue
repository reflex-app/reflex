<template>
  <div class="app-container">
    <ToolBar />
    <SiteTree />
    <slot />
  </div>
</template>

<script lang="ts">
import { onMounted } from 'vue';
import isElectron from 'is-electron';
import ToolBar from '@/components/ToolBar/index.vue';
import { ipcRenderer } from 'electron';
import SiteTree from '@/components/SiteTree/index.vue';

export default {
  components: {
    ToolBar,
    SiteTree,
  },
  setup() {
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
  },
};
</script>


<style lang="scss" scoped>
.app-container {
  height: 100%;
  width: 100%;
}
</style>
