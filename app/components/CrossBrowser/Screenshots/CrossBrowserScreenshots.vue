<template>
  <div v-if="screenshotsSorted.length || loadingSorted.length" id="cbs" class="flex flex-row ml-32 gap-4 h-full border border-gray-500 p-8 rounded-lg">
    <!-- <Trigger :data="props" @clicked="getScreenshots()" /> -->
    <!-- The cross-browser screenshots -->
    <div v-for="browserName in loadingSorted" :key="browserName">
      <div class="loading-skeleton" :style="{ height: props.height + 'px', width: props.width + 'px' }">
        <!-- <img :src="require(`~/assets/browsers/${browserName}.svg`)" /> -->
        <Icon :name="`browsers/${browserName}`" />
        {{ browserName }}
      </div>
    </div>
    <template v-if="screenshotsSorted.length">
      <div v-for="item in screenshotsSorted" :key="item.id" class="h-max w-max">
        <template v-if="item.isLoading">
          <div class="image-skeleton"></div>
          <div class="image-skeleton"></div>
        </template>
        <template v-else>
          <span class="result__type">{{ item.type }}</span>
          <img :src="item.img" :width="width" :height="height" alt="Cross-browser screenshot" class="w-auto h-full" />
        </template>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
// import { computed } from 'vue'
// import Trigger from './Trigger'
import { useHistoryStore } from '@/store/history'
import useCrossBrowserScreenshots from './UseCrossBrowserScreenshots'
import Icon from '@/components/Shared/Icon.vue'

const { $bus } = useNuxtApp()

const props = defineProps({
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
  artboardId: {
    type: String,
    default: '',
  }
})

const emit = defineEmits(['loaded'])

onMounted(() => {
  $bus.on('cross-browser:take-screenshots', async (id: string) => {
    console.log(id, props.artboardId);

    if (id === props.artboardId) {
      await getScreenshots()
    }
  })
})

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
  const url = useHistoryStore().currentPage.url

  const payload = { ...props, browsers: ['firefox', 'webkit'], url, x: props.x, y: props.y }
  console.log(payload)
  await takeCrossBrowserScreenshot(payload)

  // Emit an event to let parent know it has finished
  emit('loaded', true)
}

</script>

<style lang="scss" scoped>
#cbs {
  // position: relative;
  // height: 100%;
  // width: auto;

  .cbs__results {
    // display: flex;
    // flex-direction: row;
    // position: relative;
    // height: 100%;
    // width: 100%;
    // flex-shrink: 0;
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
      // width: 100%;
      // height: 100%;
      // max-width: 100%;
    }
  }

  .result__type {
    // position: absolute;
    // top: -2rem;
    display: block;
    font-weight: bold;
    text-transform: uppercase;
    @apply mb-4;
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
