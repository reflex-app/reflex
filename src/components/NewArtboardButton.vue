<template>
    <div class="button-new-artboard" v-on:click="$emit('add')">+</div>
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
  position: absolute;
  top: 50%;
  right: -4.5rem;
  color: #0070cd;
  background: none;
  height: 3rem;
  width: 3rem;
  border-radius: 50%;
  font-size: 1.5rem;
  line-height: 2.7rem;
  vertical-align: middle;
  text-align: center;
  border: 2px solid transparent;

  &:hover {
    cursor: pointer;
    color: #0070cd;
    border-color: #0070cd;
  }
}
</style>
