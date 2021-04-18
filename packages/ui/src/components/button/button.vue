<template lang="pug"> 
div(class="btn" :class="computedClasses")
  //- User can insert clickable content in here
  // - via a Vue <Slot/>
  slot Click me!
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'rfx-button',
  props: {
    /**
     * The kind of button
     */
    kind: {
      type: String,
      default: 'default',
      validator: function (value) {
        return ['default', 'primary', 'secondary'].includes(value)
      },
    },
  },
  setup(props) {
    const computedClasses = computed(() => {
      return {
        'btn--default': props.kind === 'default',
        'btn--primary': props.kind === 'primary',
        'btn--secondary': props.kind === 'secondary',
      }
    })

    return {
      props,
      computedClasses,
    }
  },
})
</script>

<style lang="scss" scoped>
.btn {
  @apply px-4 py-2 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75;

  &:hover {
    @apply bg-red-500;
  }
}

.btn--primary {
  @apply bg-blue-500;
}

.btn--secondary {
  @apply bg-gray-500;
}
</style>
