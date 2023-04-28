<template>
  <div class="toggle-disco" @click="toggleDisco">🕺</div>
</template>

<script>
import { useGuiStore } from '~/store/gui'

export default {
  methods: {
    toggleDisco() {
      const gui = useGuiStore()
      gui.toggleGui('discoMode')
    },
  },
}
</script>

<style lang="scss" scoped>
.toggle-disco {
  cursor: pointer;
  background: red;
  z-index: 1;
  position: relative;
}
</style>
