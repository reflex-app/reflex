<template>
  <div class="button" :class="containerStyles" @click="onClick($event)">
    <Icon v-if="icon" :name="icon" :color="iconColor" class="button__icon" />
    <span class="button__text">
      <slot></slot>
    </span>
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
    },
    rounded: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    containerStyles() {
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

      // Check for button content + icon
      const slotHasContent = !!this.$slots.default;

      if (slotHasContent && this.icon) {
        classNames.push("button--with-icon");
      }

      // If rounded
      if (this.rounded) {
        classNames.push("button--rounded");
      }

      return classNames;
    },
    iconColor() {
      if (!this.icon) return false;

      switch (this.role) {
        // Dark BG
        case "primary":
          return "light";
          break;

        // Light BG
        case "secondary":
        case "ghost":
          return "dark";
          break;
      }
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
  padding: 0.5rem 0.75rem;
  background: #ffffff;
  border: 1px solid transparent;
  border-radius: 4px;
  user-select: none;
  // box-shadow: 0 1px 2px 0px rgba(#6a6a6a, 0.2);
  cursor: pointer;
  line-height: 1;
  // transition: all 75ms ease-in-out;

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
    border-color: #b8b8b8;
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
    box-shadow: 0 0px 0px 1px $accent-color;
    color: $accent-color;
    background: white;
  }
}

.button--with-icon {
  .button__icon {
    margin-right: 0.25rem;
  }

  .button__text {
    padding-right: 0.25rem;
  }
}

.button--rounded {
  border-radius: 50%;
  padding: 0.5rem; // This is required so that it's a square
}
</style>