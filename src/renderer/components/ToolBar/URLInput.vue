<template>
  <div class="input">
    <!-- State: Focused -->
    <div v-if="state">
      <input
        id="toolbar__url"
        ref="input"
        type="text"
        placeholder="Enter a website URL (http://website.com)"
        :value="url"
        autocomplete="off"
        @keyup.enter="triggerSiteLoad($event.target.value)"
        @keyup.esc="blur()"
        @blur="$emit('toggle-input')"
        tabindex="1"
      >
    </div>
    <!-- State: Initial -->
    <div v-else>
      <span @click="$emit('toggle-input')">{{url}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "URLInput",
  props: ["state"],
  computed: {
    url() {
      return this.$store.state.site.url;
    }
  },
  watch: {
    state: function() {
      const vm = this;
      if (this.state === true) {
        vm.$nextTick(() => {
          vm.$refs.input.focus();
          vm.$refs.input.select();
        });
      }
    },
    url: function() {
      // When the URL changes...
      // update notBrowserSyncURL
      console.log('url changed');
    }
  },
  methods: {
    triggerSiteLoad(url) {
      this.$emit("url-changed", url);
      this.blur();
    },
    blur() {
      // Blur the input
      const vm = this;
      vm.$nextTick(() => {
        vm.$refs.input.blur();
      });
    }
  }
};
</script>


<style lang="scss" scoped>
@import "~@/scss/_variables";

.input {
  width: 100%;
  display: block;

  span {
    display: block;

    &:hover {
      cursor: pointer;
    }
  }
}

input[type="text"] {
  border: none;
  font-size: 1rem;
  box-sizing: border-box;
  border: 1px solid transparent;
  border-radius: 4px;
  width: 100%;
  text-overflow: ellipsis;
  display: block;
  background: $body-bg;
  // padding: 0 0.15rem;

  &:hover {
    border-color: $border-color;
    background: darken($body-bg, 5%);
  }

  &:focus {
    text-overflow: none;
    text-align: left;
    outline: none;
    background: lighten($body-bg, 3%);
    border-color: rgba($accent-color, 1);
  }
}
</style>
