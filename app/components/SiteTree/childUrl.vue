<template>
  <div>
    <div v-for="(url, i) in urls" :key="i">
      <!-- Site -->
      <input v-model="url.site" @change="updateSite(url.site, $event.target.value)" />
      <button @click="openUrl(url.site)">Open</button>
      <button @click="removeSite(url.site)" class="text-red-500">Remove</button>
      <!-- Sub-items -->
      <div v-for="(path, j) in url.paths" :key="j" class="ml-4">
        <input :value="path" @input="updatePath(url.site, path, $event.target.value)" />
        <button @click="openUrl(url.site + path)">Open</button>
        <button @click="removePath(url.site, path)" class="text-red-500">Remove</button>
      </div>
      <input v-model="newPath[url.site]" @keyup.enter="addPath(url.site, newPath[url.site]); newPath[url.site] = ''"
        placeholder="Add path" />
      <hr />
    </div>
    <hr />
    <input v-model="newSite" @keyup.enter="addSite(newSite); newSite = ''" placeholder="Add site" />
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useUrlsStore } from '@/store/site-tree'

const urlsStore = useUrlsStore()
const state = reactive({
  newSite: '',
  newPath: {} as { [key: string]: string }
})

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
  window.open(url, '_blank')
}

const { urls } = urlsStore.$state
const { newSite, newPath } = state
</script>

<style lang="scss" scoped>
input {
  @apply p-2
}
</style>
