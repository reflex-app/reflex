<template>
  <div
    class="toggle-disco"
    @click="toggleDisco"
    title="Click to toggle Disco Mode"
  >
    🕺
  </div>
</template>

<script>
export default {
  methods: {
    toggleDisco() {
      this.$store.commit('gui/toggleGui', 'discoMode')
    },
  },
}
</script>

<style lang="scss" scoped>
.toggle-disco {
  cursor: pointer;
  z-index: 1;
  position: relative;
  display: inline-block;
}
</style>
