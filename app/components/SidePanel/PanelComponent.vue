<template>
  <div id="panel-container">
    <!-- <div class="panel__header">
      {{ title }}
    </div>-->
    <div class="panel__content">
      <ToggleScreenHeights />
      <ScreensPanel v-show="isChildPanel('Screens')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ScreensPanel from './ScreensPanel.vue'
import ToggleScreenHeights from '../Screens/ToggleScreenHeights.vue';

const props = defineProps({
  title: String,
})

const isChildPanel = (val: string): boolean => {
  return props.title === val
}

</script>

<style lang="scss" scoped>
@import '../../scss/_variables';

#panel-container {
  position: absolute;
  top: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  border-right: 1px solid $border-color;
  width: 18rem;
  overflow: auto;
  cursor: default;
  overflow: hidden;
  background: white;
  z-index: 1;

  .panel__header {
    padding: 1rem 1rem;
    font-size: 1.3rem;
    // font-weight: bold;
    border-bottom: 1px solid $border-color;
  }

  .panel__content {
    position: relative;
    height: 100%;

    // Applies style to children
    & >>> .panel-section {
      margin-bottom: 1rem;
      margin-left: 1rem;
      margin-right: 1rem;

      &:first-child {
        margin-top: 1rem;
      }
    }
  }
}
</style>
