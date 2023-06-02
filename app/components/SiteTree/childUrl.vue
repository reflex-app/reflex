<template>
  <div class="flex flex-col gap-12">
    <div v-for="(url, i) in urls" :key="i">
      <div class="flex justify-between">
        <input v-model="url.site" @change="updateSite(url.site, $event.target.value)" class="font-bold" />
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
          <button @click="removePath(url.site, subPath.fullPath)" class="text-red-500">Remove</button>
          <button @click="openUrl(url.site + subPath.fullPath)" class="text-blue-500">Open</button>
        </div>
      </div>
      <div class="ml-4">
        <input v-model="newPath[url.site]" @keyup.enter="addPath(url.site, newPath[url.site]); newPath[url.site] = ''"
          placeholder="Add path" class="w-full" />
        <hr />
      </div>
    </div>
    <input v-model="newSite" @keyup.enter="addSite(newSite); newSite = ''" placeholder="Add site" />
  </div>
</template>

<script setup lang="ts">
import { useUrlsStore, Path, Status } from '@/store/site-tree'
import { useHistoryStore } from '@/store/history'

const history = useHistoryStore()

const urlsStore = useUrlsStore()
const state = reactive({
  newSite: '',
  newPath: {} as { [key: string]: string }
})

const itemStatus = () => computed({
  get: (site, path) => urlsStore.getStatusForPath(site, path),
  set: (value) => {
    // Update the status of the specific item in the Pinia store
    // You can use appropriate actions or mutations in the store to update the status
  },
});

const addSite = (site: string) => {
  urlsStore.addSite(site)
  state.newPath[site] = ''
}

const addPath = (site: string, path: string) => {
  urlsStore.addPath(site, path)
}

const removeSite = (site: string) => {
  urlsStore.removeSite(site)
}

const removePath = (site: string, path: string) => {
  urlsStore.removePath(site, path)
}

const updateSite = (oldSite: string, newSite: string) => {
  urlsStore.updateSite(oldSite, newSite)
}

const updatePath = (site: string, oldPath: string, newPath: string) => {
  urlsStore.updatePath(site, oldPath, newPath)
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

const updateStatus = (site: string, path: string, value: keyof typeof Status) => {
  urlsStore.updateStatus(site, path, value)
}

const { urls } = urlsStore.$state
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
