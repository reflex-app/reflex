<template>
  <div class="cbs">
    <button
      class="cbs__button"
      v-if="!isLoading"
      @click="takeCrossBrowserScreenshot()"
    >
      Click me
    </button>
    <div v-if="isLoading" class="cbs__loading">Loading...</div>
    <div class="cbs__results">
      <div v-for="item in crossBrowserScreens" :key="item.id">
        {{ item.type }}
        <img
          :src="item.img"
          :height="height"
          :width="width"
          alt="Cross-browser screenshot"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {
  takeScreenshots,
  toBase64Image,
} from '~/components/CrossBrowser/Screenshots'
import { mapState } from 'vuex'

export default {
  props: {
    height: {
      type: Number,
      default: 100,
    },
    width: {
      type: Number,
      default: 100,
    },
  },
  data() {
    return {
      isLoading: false,
      crossBrowserScreens: [], // Stores any browser screenshots
    }
  },
  computed: {
    ...mapState({
      url: (state) => state.history.currentPage.url, // We grab the current URL
    }),
  },
  methods: {
    async takeCrossBrowserScreenshot() {
      // Update loading state
      this.isLoading = true

      // Return the screenshot to the frame
      const screenshots = await takeScreenshots(
        this.url,
        ['chromium', 'firefox', 'webkit'],
        this.height,
        this.width
      )

      // Empty out the current list
      this.crossBrowserScreens = []

      // Add new screens to local data
      for (const screenshot of screenshots) {
        screenshot.img = toBase64Image(screenshot.img) // Convert buffer to base64
        this.crossBrowserScreens.push(screenshot)
      }

      // Update loading state
      this.isLoading = false
    },
  },
}
</script>

<style lang="scss" scoped>
.cbs {
  .cbs__results {
    display: flex;
    flex-direction: row;
    // flex-wrap: wrap;
    max-width: 100%;

    & > *:not(:first-child) {
      margin-left: 1rem;
    }

    // display: grid;
    // column-gap: 1rem;
    // row-gap: 1rem;
    // grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    img {
      width: 100%;
      height: auto;
    }
  }
}
</style>
