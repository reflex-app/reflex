<template>
  <div class="cbs">
    <Trigger :data="props" @clicked="getScreenshots()" />
    <!-- The cross-browser screenshots -->
    <div class="cbs__results">
      <template v-if="screenshots.length">
        <div v-for="item in screenshots" :key="item.id">
          <span class="result__type">({{ item.type }})</span>
          <img
            :src="item.img"
            :height="height"
            :width="width"
            alt="Cross-browser screenshot"
          />
        </div>
      </template>
      <template v-else>
        <div class="image-skeleton">Hey there</div>
        <div class="image-skeleton">Hey there</div>
      </template>
    </div>
  </div>
</template>

<script>
import { toRefs } from '@vue/composition-api'
import Trigger from './Trigger'
import {
  browserContexts,
  takeScreenshots,
  toBase64Image,
} from '~/components/CrossBrowser/Screenshots'
import useCrossBrowserScreenshots from './UseCrossBrowserScreenshots'
export default {
  components: {
    Trigger,
  },
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
  setup(props, { emit, root: { $store } }) {
    const { state, takeCrossBrowserScreenshot } = useCrossBrowserScreenshots()

    // function showSkeletonLoader(count) {
    //   for (let i in count) {
    //     state.screenshots.push({ type: 'webkit', img: '' })
    //   }
    // }

    // function hideSkeletonLoader(count) {
    //   for (let i in count) {
    //     state.screenshots.splice(i, 1)
    //   }
    // }

    async function getScreenshots() {
      const url = $store.state.history.currentPage.url

      const payload = { ...props, browsers: ['firefox', 'webkit'], url }
      console.log(payload)
      await takeCrossBrowserScreenshot(payload)

      // Emit an event to let parent know it has finished
      emit('loaded', true)
    }

    return {
      ...toRefs(state), // Returns invidual parts of the state
      props,
      getScreenshots,
    }
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

  .image-skeleton {
    background: gray;
    height: 100%;
    width: 100%;
  }
}
</style>
