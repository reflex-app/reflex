<template lang="pug"> 
button(class="btn" :class="[variantClasses]" v-bind="$attrs")
  slot Click me!
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

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
  setup(props, ctx) {
    const variantClasses = computed(() => {
      return {
        'btn--default': props.kind === 'default',
        'btn--primary': props.kind === 'primary',
        'btn--secondary': props.kind === 'secondary',
      }
    })

    return {
      props,
      variantClasses,
    }
  },
})
</script>

<style lang="scss" scoped>
.btn {
  @apply px-4 py-2 text-black font-semibold rounded-lg shadow-md;

  &:hover {
    @apply bg-red-500;
  }

  &:focus {
    @apply outline-none ring-2 ring-red-500 ring-opacity-75;
  }
}

.btn--primary {
  @apply text-white bg-blue-500;
}

.btn--secondary {
  @apply text-black bg-gray-200;
}
</style>
