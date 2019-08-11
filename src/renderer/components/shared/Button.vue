<template>
  <div class="button" :class="styles" @click="onClick($event)">
    <Icon v-if="icon" :name="icon" class="icon"/>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    role: {
      type: String,
      default: "secondary"
    },
    icon: {
      type: String
    }
  },
  computed: {
    styles() {
      // Returns a class name based on
      // some logic w/ props
      let classNames = [];

      // Set primary/secondary
      switch (this.role) {
        case "primary":
          classNames.push("button--primary");
          break;

        case "secondary":
          classNames.push("button--secondary");
          break;

        case "ghost":
          classNames.push("button--ghost");
          break;
      }
      return classNames;
    }
  },
  methods: {
    /**
     * Emits a 'click' event
     * Can be listened via @click
     */
    onClick(event) {
      this.$emit("click", event);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/scss/_variables.scss";

.button {
  display: inline-flex;
  align-items: center;
  padding: 0.3rem 0.75rem;
  background: #ffffff;
  border: 1px solid #b8b8b8;
  border-radius: 4px;
  user-select: none;
  box-shadow: 0 1px 2px 0px rgba(#6a6a6a, 0.2);
  cursor: pointer;

  // &:hover {
  //   background: #f5f5f5;
  // }

  // &:active {
  //   color: darken(#6f6f6f, 40%);
  //   background: darken(white, 20%);
  // }

  &.button--primary {
    color: white;
    background: $accent-color;

    &:hover {
      cursor: pointer;
      background: $accent-color;
    }

    &:active {
      color: white;
      background: darken($accent-color, 15%);
    }
  }

  &.button--secondary {
    // &:hover {
    //   background: #f5f5f5;
    // }

    &:active {
      color: darken(#6f6f6f, 40%);
      background: darken(white, 20%);
    }
  }

  &.button--ghost {
    box-shadow: none;
    border: none;

    &:hover {
      background: #efefef;
    }

    &:active {
      color: darken(#6f6f6f, 40%);
      background: #cecece;
    }
  }

  &.button--is-active {
    color: white;
    border-color: $accent-color;
    background: $accent-color;
    box-shadow: 0 0px 0px 1px $accent-color;
    color: $accent-color;
    background: white;
  }

  .icon {
    margin-right: 0.5rem;
  }
}
</style>