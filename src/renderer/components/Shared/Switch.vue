<template>
  <div class="switch-mode-container" @click.stop="toggle">
    <label for="switch">{{label}}</label>
    <input type="checkbox" :checked="isChecked" />
    <div class="switch" :class="{ 'is-active' : isChecked }"></div>
  </div>
</template>

<script>
export default {
  name: "Switch",
  data() {
    return {
      checked: false
    };
  },
  computed: {
    isChecked: function() {
      return this.checked;
    }
  },
  props: {
    /**
     * Sets the initial value of the switch
     * On | Off
     */
    value: {
      type: Boolean,
      default: false
    },
    /**
     * Text label
     */
    label: {
      type: String,
      default: "Label"
    }
  },
  methods: {
    /**
     * Toggle the boolean value
     */
    toggle() {
      this.checked = !this.checked;
      this.$emit("onToggle", this.checked); // Emit event and Boolean
    }
  },
  mounted() {
    // Set the initial value
    this.checked = this.value;
  }
};
</script>

<style lang="scss" scoped>
.switch-mode-container {
  display: flex;
  align-items: center;
  z-index: 1;
}

a {
  display: flex;

  &:not(:first-child) {
    margin-left: 0.25rem;
  }

  &:last-child {
    margin-right: 1rem;
  }
}

input[type="checkbox"] {
  height: 0;
  width: 0;
  visibility: hidden;
}

label {
  margin-left: 0.5rem;
  pointer-events: none; // Don't steal click events!
}

.switch {
  cursor: pointer;
  text-indent: -9999px;
  width: 40px;
  height: 20px;
  background: grey;
  display: block;
  border-radius: 100px;
  position: relative;
  cursor: pointer;

  &.is-active {
    background: #bada55;

    &:after {
      left: calc(100% - 5px);
      transform: translateX(-100%);
    }
  }

  &:after {
    content: "";
    position: absolute;
    top: 5px;
    left: 5px;
    width: 10px;
    height: 10px;
    background: #fff;
    border-radius: 90px;
    transition: 0.3s;

    &:after {
      width: 40%;
    }
  }
}
</style>