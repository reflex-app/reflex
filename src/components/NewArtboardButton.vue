<template>
    <div class="button button-new-artboard" v-on:click="$emit('add')">+</div>
</template>

<script>
export default {
  name: "NewArtboardButton",
  props: {},
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
@import "../scss/_variables";

.button-new-artboard {
  position: relative;
  height: 3rem;
  border: none;
  width: 100%;
  padding: 0;
  font-size: 1.5rem;
  line-height: 2.7rem;
  vertical-align: middle;
  text-align: center;
  border-radius: 0;
  color: white;
  background: $accent-color;

  &:hover {
    cursor: pointer;
    background: darken($accent-color, 5%);
  }

  &:active {
    color: white;
    background: darken($accent-color, 15%);
  }
}
</style>
