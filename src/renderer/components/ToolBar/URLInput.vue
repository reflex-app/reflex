<template>
  <div class="input">
    <!-- State: Focused -->
    <div v-if="state">
      <input
        id="toolbar__url"
        ref="input"
        type="text"
        placeholder="Enter a website URL (https://google.com)"
        :value="url"
        autocomplete="off"
        tabindex="1"
        @keyup.enter="triggerSiteLoad($event.target.value)"
        @keyup.esc="blur()"
        @blur="$emit('toggle-input')"
      >
    </div>
    <!-- State: Initial -->
    <div v-else>
      <span @click="$emit('toggle-input')">
        <span v-if="url">
          {{ url }}
        </span>
        <span v-else>
          Enter a website URL
        </span>
      </span>
    </div>
  </div>
</template>

<script>
import autoCorrectURL from '@/mixins/autoCorrectURL.js'

export default {
  name: 'URLInput',
  props: ['state'],
  computed: {
    url() {
      return this.$store.state.site.url
    }
  },
  watch: {
    state: function() {
      const vm = this
      if (this.state === true) {
        // When clicked, select the text in the input
        vm.$nextTick(() => {
          vm.$refs.input.focus()
          vm.$refs.input.select()
        })
      }
    },
    url: function() {
      // When the URL changes...
      // update notBrowserSyncURL
      console.log('url changed')
    }
  },
  methods: {
    async triggerSiteLoad(url) {
      if (!url) return false

      // Validate URL
      const newURL = await this.validateURL(url)
      this.$emit('url-changed', newURL)
      this.blur()
    },
    blur() {
      // Blur the input
      const vm = this
      vm.$nextTick(() => {
        vm.$refs.input.blur()
      })
    },
    async validateURL(url) {
      try {
        // @TODO: Refactor/simplify the URL corrector
        return autoCorrectURL(url)
      } catch (e) {
        return false
      }
    }
  }
}
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
  width: 100%;
  display: block;
  // border-radius: 6px;
  background: $body-bg;
  text-overflow: ellipsis;
  border-radius: 40px;
  border: 1px solid transparent;
  padding: 0.4rem 1rem;

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
