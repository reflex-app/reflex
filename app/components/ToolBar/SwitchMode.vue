<template>
  <div class="switch-mode-container">
    <div v-feature-flipping="'focus-mode'">
      <nuxt-link to="/focus">
        <Button role="ghost" icon="mode-focus" :tight="true" title="Single Screen"
          :is-pressed="isRouteActive('/focus')" />
      </nuxt-link>
    </div>
    <nuxt-link to="/">
      <Button role="ghost" icon="mode-all" :tight="true" title="All Screens" :is-pressed="isRouteActive('/')" />
    </nuxt-link>

    <!-- <input type="checkbox" id="switch" :checked="toggleState" /> -->
    <!-- <label for="switch" @click="toggle" :class="{ 'is-active' : toggleState }">Toggle</label> -->
  </div>
</template>

<script>
// import { mapState } from 'vuex'
import { mapState } from 'pinia'
export default {
  computed: {
    ...mapState({
      toggleState: (state) => state.gui.focusMode,
    }),
  },
  methods: {
    toggle() {
      const focus = useFocusMode()
      focus.toggleGui('focusMode')
    },
    isRouteActive(id) {
      if (this.$route.path === id) {
        return true
      } else {
        return false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.switch-mode-container {
  display: flex;
  align-items: center;
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

input[type='checkbox'] {
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
  content: '';
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
