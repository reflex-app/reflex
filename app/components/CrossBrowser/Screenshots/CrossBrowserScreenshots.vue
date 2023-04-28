<template>
  <div class="cbs">
    <!-- <Trigger :data="props" @clicked="getScreenshots()" /> -->
    <!-- The cross-browser screenshots -->
    <div class="cbs__results">
      <div v-for="browserName in loadingSorted" :key="browserName.id">
        <div class="loading-skeleton" :style="{ height: props.height + 'px', width: props.width + 'px' }">
          <img :src="require(`~/assets/browsers/${browserName}.svg`)" />
          {{ browserName }}
        </div>
      </div>
      <template v-if="screenshotsSorted.length">
        <div v-for="item in screenshotsSorted" :key="item.id">
          <template v-if="item.isLoading">
            <div class="image-skeleton">Hey there</div>
            <div class="image-skeleton">Hey there</div>
          </template>
          <template v-else>
            <span class="result__type">{{ item.type }}</span>
            <img :src="item.img" :height="height" :width="width" alt="Cross-browser screenshot" />
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
// import { computed } from 'vue'
// import Trigger from './Trigger'
import useCrossBrowserScreenshots from './UseCrossBrowserScreenshots'
export default {
  // components: {
  //   Trigger,
  // },
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

    const loadingSorted = computed(() => {
      function compare(a, b) {
        if (a < b) return -1
        if (a > b) return 1
        return 0
      }

      return state.loading.sort(compare)
    })

    const screenshotsSorted = computed(() => {
      function compare(a, b) {
        if (a.type < b.type) return -1
        if (a.type > b.type) return 1
        return 0
      }

      return state.screenshots.sort(compare)
    })

    async function getScreenshots() {
      const url = $store.state.history.currentPage.url

      const payload = { ...props, browsers: ['firefox', 'webkit'], url }
      console.log(payload)
      await takeCrossBrowserScreenshot(payload)

      // Emit an event to let parent know it has finished
      emit('loaded', true)
    }

    return {
      // ...toRefs(state), // Returns invidual parts of the state
      loadingSorted,
      screenshotsSorted,
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

    &>* {
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
}

.loading-skeleton {
  background: #eeeeee;
  border: 1rem dashed #cfcfcf;
  height: 100%;
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex-wrap: wrap;
  font-size: 1rem;
  font-weight: bold;

  &>* {
    display: block;
    height: 50%;
    animation: pulse 2s infinite;
  }
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
  }

  70% {
    transform: scale(1);
  }

  100% {
    transform: scale(0.95);
  }
}
</style>
