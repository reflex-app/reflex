<template>
  <div>
    <input type="checkbox" id="switch" :checked="toggleState" />
    <label for="switch" @click="toggle" :class="{ 'is-active' : toggleState }">Toggle</label>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      toggleState: state => state.gui.focusMode
    })
  },
  methods: {
    toggle() {
      this.$store.commit("toggleFocusMode");
    }
  }
};
</script>

<style lang="scss" scoped>
input[type="checkbox"] {
  height: 0;
  width: 0;
  visibility: hidden;
}

label {
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
}

label:after {
  content: "";
  position: absolute;
  top: 5px;
  left: 5px;
  width: 10px;
  height: 10px;
  background: #fff;
  border-radius: 90px;
  transition: 0.3s;
}

label:active:after {
  width: 40%;
}
</style>