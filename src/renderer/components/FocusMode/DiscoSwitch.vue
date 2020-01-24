<template>
  <div class="toggle-disco" @click="toggleDisco">🕺</div>
</template>

<script>
export default {
  methods: {
    toggleDisco() {
      this.$store.commit("gui/toggleGui", "discoMode");
    }
  }
};
</script>

<style lang="scss" scoped>
.toggle-disco {
  cursor: pointer;
  background: red;
  z-index: 1;
  position: relative;
}
</style>