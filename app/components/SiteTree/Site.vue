<template>
  <div class="relative">
    <div class="flex justify-between">
      <input
        v-model="url.site"
        @change="updateSite(url.site, $event.target.value)"
        class="font-bold"
        data-testid="site-title"
      />
      <div class="flex justify-between gap-4">
        <button @click="removeSite(url.site)" class="text-red-500">
          Remove
        </button>
        <button @click="openUrl(url.site)" class="text-blue-500">Open</button>
      </div>
    </div>
    <div
      v-for="(subPath, k) in getSubPaths(url.paths)"
      :key="k"
      :style="{ marginLeft: subPath.depth * 2 + 'rem' }"
      class="item flex justify-between"
      :class="{ 'item--indented': subPath.depth > 0 }"
    >
      <div class="item__title">
        <input
          :value="subPath.path"
          @input="updatePath(url.site, subPath.fullPath, $event.target.value)"
        />
      </div>
      <div class="flex justify-between gap-4">
        <div>
          <select
            v-model="subPath.status"
            @input="
              updateStatus(url.site, subPath.fullPath, $event.target.value)
            "
          >
            <option v-for="(value, key) in Status" :key="key" :value="key">
              {{ value }}
            </option>
          </select>
        </div>
        <button
          @click="screenshotAll(url.site + subPath.fullPath)"
          class="text-blue-500"
        >
          <Icon name="camera" />
        </button>
        <button
          @click="removePath(url.site, subPath.fullPath)"
          class="text-red-500"
        >
          Remove
        </button>
        <button
          @click="openUrl(url.site + subPath.fullPath)"
          class="text-blue-500"
        >
          Open
        </button>
      </div>
    </div>
    <div class="">
      <input
        v-model="sitePath"
        @keyup.enter="addPathAndClearInput(url.site, $event.target.value)"
        placeholder="Add sub-path (e.g. /about)"
        class="w-full"
        data-testid="path-input"
      />
      <hr />
    </div>
  </div>
</template>

<script setup lang="ts">
import useSiteTreeStore, { Path, Status } from '@/store/site-tree'
import { useHistoryStore } from '@/store/history'
import * as capture from '../Screenshot/capture'
import Icon from '@/components/Shared/Icon.vue'

const history = useHistoryStore()

const props = defineProps<{
  url: {
    site: string
    paths: Path[]
  }
}>()

const {
  addSite,
  addPath,
  removeSite,
  removePath,
  updateSite,
  updatePath,
  updateStatus,
  urls,
} = useSiteTreeStore()

const sitePath = ref<HTMLInputElement | null>()

const openUrl = (url: string) => {
  history.changeSiteData({ url })
}

const getSubPaths = (paths: Path[], prefix = '', depth = 0) => {
  const subPaths = []
  for (const path of paths) {
    const fullPath = prefix + '/' + path.path
    subPaths.push({ path: path.path, fullPath, depth, status: path.status })
    subPaths.push(...getSubPaths(path.children, fullPath, depth + 1))
  }
  return subPaths
}

const screenshotAll = async (url: string) => {
  history.changeSiteData({ url: url })
  await capture.captureAll({
    url,
  })
}

const addPathAndClearInput = (site: string, path: string) => {
  addPath(site, path)
  sitePath.value = null
}
</script>

<style lang="scss" scoped>
.item__title {
  position: relative;
}

.item--indented .item__title:before {
  content: '';
  position: absolute;
  left: -1rem;
  top: 0.5rem;
  width: 20px;
  height: 20px;
  background-image: url("data:image/svg+xml,%3Csvg width='7' height='8' viewBox='0 0 7 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0.5 0V7H7' stroke='%23BFBFBF'/%3E%3C/svg%3E%0A");
  background-repeat: no-repeat;
}

input {
  @apply p-1;
}
</style>
