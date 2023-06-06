<template>
  <div class="flex flex-col gap-12">
    <div v-for="(url, i) in urls" :key="i">
      <div class="flex justify-between">
        <input v-model="url.site" @change="updateSite(url.site, $event.target.value)" class="font-bold"
          data-testid="site-title" />
        <div class="flex justify-between gap-4">
          <button @click="removeSite(url.site)" class="text-red-500">Remove</button>
          <button @click="openUrl(url.site)" class="text-blue-500">Open</button>
        </div>
      </div>
      <div v-for="(subPath, k) in getSubPaths(url.paths)" :key="k" :style="{ marginLeft: subPath.depth * 2 + 'rem' }"
        class="item flex justify-between" :class="{ 'item--indented': subPath.depth > 0 }">
        <div class="item__title">
          <input :value="subPath.path" @input="updatePath(url.site, subPath.fullPath, $event.target.value)" />
        </div>
        <div class="flex justify-between gap-4">
          <div>
            <select v-model="subPath.status" @input="updateStatus(url.site, subPath.fullPath, $event.target.value)">
              <option v-for="(value, key) in Status" :key="key" :value="key">
                {{ value }}
              </option>
            </select>
          </div>
          <button @click="screenshotAll(url.site + subPath.fullPath)" class="text-blue-500">
            <Icon name="camera" />
          </button>
          <button @click="removePath(url.site, subPath.fullPath)" class="text-red-500">Remove</button>
          <button @click="openUrl(url.site + subPath.fullPath)" class="text-blue-500">Open</button>
        </div>
      </div>
      <div class="ml-4">
        <input v-model="sitePath" @keyup.enter="addPath(url.site, $event.target.value)"
          placeholder="Add sub-path (e.g. /about)" class="w-full" data-testid="path-input" />
        <hr />
      </div>
    </div>
    <input v-model="siteInput" @keyup.enter="addSite($event.target.value)" placeholder="Enter site URL (e.g. google.com)"
      data-testid="site-input" />
  </div>
</template>

<script setup lang="ts">
import { useSiteTree, Path, Status } from '@/store/site-tree'
import { useHistoryStore } from '@/store/history'
import * as capture from '../Screenshot/capture'
import Icon from '@/components/Shared/Icon.vue'

const history = useHistoryStore()

const siteInput = ref<HTMLInputElement | null>()
const sitePath = ref<HTMLInputElement | null>()

const siteTreeStore = useSiteTree()
const state = reactive({
  newPath: {} as { [key: string]: string }
})

const addSite = (site: string) => {
  siteTreeStore.addSite(site)
  siteInput.value = null // Clear input
}

const addPath = (site: string, path: string) => {
  siteTreeStore.addPath(site, path)
  sitePath.value = null // Clear input
}

const removeSite = (site: string) => {
  siteTreeStore.removeSite(site)
}

const removePath = (site: string, path: string) => {
  siteTreeStore.removePath(site, path)
}

const updateSite = (oldSite: string, newSite: string) => {
  siteTreeStore.updateSite(oldSite, newSite)
}

const updatePath = (site: string, oldPath: string, newPath: string) => {
  siteTreeStore.updatePath(site, oldPath, newPath)
}

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
    url
  })
}

const updateStatus = (site: string, path: string, value: keyof typeof Status) => {
  siteTreeStore.updateStatus(site, path, value)
}

const { urls } = siteTreeStore.$state
const { newSite, newPath } = state
</script>

<style lang="scss" scoped>
.item {
  @apply relative px-4 py-2;
  @apply rounded-md;

  &:hover {
    @apply bg-gray-100;
  }

  &.item--indented .item__title:before {
    content: '';
    // display: inline-block;
    position: absolute;
    left: 0;
    top: 1rem;
    width: 20px;
    height: 20px;
    background-image: url("data:image/svg+xml,%3Csvg width='7' height='8' viewBox='0 0 7 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0.5 0V7H7' stroke='%23BFBFBF'/%3E%3C/svg%3E%0A");
    background-repeat: no-repeat;
  }
}

input {
  @apply p-1;
}
</style>
