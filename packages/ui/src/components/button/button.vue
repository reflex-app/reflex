<template>
  <h1>Hi there!</h1>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'rfx-button',
  props: {
    msg: String,
  },
  data() {
    return {
      count: 0,
    }
  },
})
</script>
