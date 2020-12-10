<template>
  <div class="cbs">
    <div class="absolute-box">
      <!-- Loading -->
      <div v-if="isLoading" class="cbs__loading">Loading...</div>
      <!-- Displays the currently running browsers -->
      <div v-if="browserContexts.active.length">
        <div v-for="item in browserContexts.active" :key="item.id">
          {{ item.type }} | {{ item.id }}
        </div>
      </div>
      <!-- Trigger -->
      <button
        class="cbs__button"
        v-if="!isLoading"
        @click="takeCrossBrowserScreenshot()"
      >
        Screenshot other browsers
      </button>
    </div>
    <!-- The cross-browser screenshots -->

    <div class="cbs__results">
      <div v-for="item in crossBrowserScreens" :key="item.id">
        <span class="result__type">({{ item.type }})</span>
        <template v-if="item.img">
          <img
            :src="item.img"
            :height="height"
            :width="width"
            alt="Cross-browser screenshot"
          />
        </template>
        <!-- Skeleton loading state -->
        <template v-else>
          <template v-if="isLoading">
            <div class="image-skeleton"></div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import {
  browserContexts,
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
    x: {
      type: Number,
      default: 0,
    },
    y: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      isLoading: false,
      crossBrowserScreens: [], // Stores any browser screenshots
      browserContexts,
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

      // Browsers
      const browsers = ['firefox', 'webkit']

      // Empty out the current list
      this.crossBrowserScreens = []

      // Add a temporary frame for each browser
      this.showSkeletonLoader(browsers.length)

      // Render the image to the front-end as it loads
      const renderImage = (screenshot) => {
        if (!screenshot) return false
        console.log(screenshot)
        screenshot.img = toBase64Image(screenshot.img) // Convert buffer to base64
        this.crossBrowserScreens.push(screenshot)
        return true
      }

      // Return the screenshot to the frame
      const screenshots = await takeScreenshots(
        {
          url: this.url,
          browsers: browsers,
          height: this.height,
          width: this.width,
          x: this.x,
          y: this.y,
        },
        renderImage
      )

      // Update loading state
      this.isLoading = false

      // Hide the skeleton loader
      this.hideSkeletonLoader(browsers.length)

      // Emit an event to let parent know it has finished
      this.$emit('loaded', true)
    },
    showSkeletonLoader(count) {
      for (let i in count) {
        this.crossBrowserScreens.push({ type: 'webkit', img: '' })
      }
    },
    hideSkeletonLoader(count) {
      for (let i in count) {
        this.crossBrowserScreens.splice(i, 1)
      }
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
    // max-width: 100%;

    & > * {
      margin-left: 4rem;
    }

    // display: grid;
    // column-gap: 1rem;
    // row-gap: 1rem;
    // grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    img {
      //   width: 100%;
      //   height: auto;
    }
  }

  .result__type {
    position: absolute;
    top: -2rem;
    font-weight: bold;
    text-transform: uppercase;
  }

  .absolute-box {
    position: absolute;
    top: -4rem;
  }

  .image-skeleton {
    background: gray;
    height: 100%;
    width: 100%;
  }
}
</style>
