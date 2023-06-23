<template>
  <div class="flex flex-col gap-4 mt-8">
    <div v-for="(url, i) in urls" :key="i">
      <Site :url="url" />
    </div>
    <input
      v-model="siteInput"
      @keyup.enter="addSiteAndClearInput($event.target.value)"
      placeholder="Enter site URL (e.g. google.com)"
      class="mt-4 w-full"
      data-testid="site-input"
    />
  </div>
</template>

<script setup lang="ts">
import useSiteTreeStore, { Path } from '@/store/site-tree'
import Site from './Site.vue'

const siteInput = ref<HTMLInputElement | null>()

const { addSite, urls } = useSiteTreeStore()

const getSubPaths = (paths: Path[], prefix = '', depth = 0) => {
  const subPaths = []
  for (const path of paths) {
    const fullPath = prefix + '/' + path.path
    subPaths.push({ path: path.path, fullPath, depth, status: path.status })
    subPaths.push(...getSubPaths(path.children, fullPath, depth + 1))
  }
  return subPaths
}

const addSiteAndClearInput = (url: string) => {
  const didAddSite = addSite(url)

  console.log('didAddSite', didAddSite)

  if (didAddSite === false) {
    // TODO: show nice alert
    alert('Site already exists')
    return false
  }

  siteInput.value = null
}
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
