<template>
  <div>
    <button>
      <slot>Click me!</slot>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'rfx-button',
})
</script>
