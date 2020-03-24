<template>
  <div>
    <input
      ref="input"
      type="text"
      placeholder="Title"
      @keyup="$emit('keyup')"
    />
  </div>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: 'Enter something...'
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/scss/_variables";

input[type="text"],
input[type="number"] {
  position: relative;
  border: 1px solid $border-color;
  border-radius: 4px;
  font-size: 0.9rem;
  background: white;
  padding: 0.5rem 0.5rem;
  outline: none;

  &:not(:last-child) {
    margin-bottom: 0.25rem;
  }

  &:hover {
    // background: white;
    // box-shadow: 0 0px 0px 1px #cbcbcb;
  }

  &:focus {
    border-color: $accent-color;
    color: $accent-color;
  }

  & + input {
    margin-top: 4px;
  }
}
</style>