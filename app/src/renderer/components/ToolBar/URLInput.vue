<template>
  <div class="input">
    <!-- State: Focused -->
    <div v-if="state">
      <input id="toolbar__url" ref="input" type="text" placeholder="Enter a website URL (https://google.com)" :value="url"
        autocomplete="off" tabindex="1" @keyup.enter="triggerSiteLoad($event.target.value)" @keyup.esc="blur()"
        @blur="$emit('toggle-input')" />
    </div>
    <!-- State: Initial -->
    <span v-else @click="$emit('toggle-input')">
      <span v-if="url" class="url" :title="url">{{ url }}</span>
      <span v-else>Enter a website URL</span>
    </span>
  </div>
</template>

<script lang="ts">
import autoCorrectURL from '@/mixins/autoCorrectURL.js'
import { useHistoryStore } from '~/store/history'
import { mapState } from 'pinia'

export default {
  name: 'URLInput',
  props: {
    state: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  computed: {
    ...mapState(useHistoryStore, {
      url: (state) => state.currentPage.url,
    }),
  },
  watch: {
    state() {
      const vm = this
      if (this.state === true) {
        // When clicked, select the text in the input
        vm.$nextTick(() => {
          vm.$refs.input.focus()
          vm.$refs.input.select()
        })
      }
    },
    url() {
      // When the URL changes...
      // update notBrowserSyncURL
      console.log('url changed')
    },
  },
  methods: {
    async triggerSiteLoad(url) {
      if (!url) return false

      // Validate URL
      const newURL = await this.validateURL(url)

      // URL has changed
      this.$emit('url-changed', newURL)

      // Make text not editable again
      this.$emit('toggle-input')
    },
    blur() {
      // Blur the input
      this.$nextTick(() => {
        (this.$refs.input as HTMLInputElement).blur()
      })
    },
    validateURL(url) {
      try {
        // @TODO: Refactor/simplify the URL corrector
        return autoCorrectURL(url)
      } catch (e) {
        return false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/scss/_variables';

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

input[type='text'] {
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
  padding: 0.2rem 1rem;

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

.url {
  max-width: 200px;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
