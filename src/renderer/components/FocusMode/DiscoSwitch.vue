<template>
  <div @click="toggleDisco">🕺</div>
</template>

<script>
export default {
  methods: {
    toggleDisco() {
      this.$store.commit("toggleGui", "discoMode");
    }
  }
};
</script>

<style lang="scss" scoped>
</style>