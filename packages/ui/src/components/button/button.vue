<template>
  <div>
    <button>
      <slot>Click me!</slot>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { styled } from '@/stitches.config'

export default defineComponent({
  name: 'rfx-button',
  render: function () {
    return styled('button', {}) // Best practice for doing this with Vue?
  },
})
</script>
