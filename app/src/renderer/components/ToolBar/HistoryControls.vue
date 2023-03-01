<template>
  <div class="controls">
    <Button
      v-if="canGoBack"
      role="ghost"
      :rounded="true"
      :tight="true"
      icon="arrow-left"
      title="Back"
      @click="back"
    />
    <Button
      v-if="canGoForward"
      role="ghost"
      :rounded="true"
      :tight="true"
      icon="arrow-right"
      title="Forward"
      @click="forward"
    />
    <Button
      role="ghost"
      :rounded="true"
      :tight="true"
      icon="reload"
      title="Forward"
      @click="reload"
    />
  </div>
</template>

<script lang="ts">
import { mapActions, mapState } from 'pinia'
import { useHistoryStore } from '~/store/history'

export default {
  computed: {
    // ...mapState({
    //   pages: (useHistoryStore, ['history.pages']),
    //   currentPage: (useHistoryStore, ['history.currentPage.index']),
    //   history: (useHistoryStore, ['history']),
    // }),
    ...mapState(useHistoryStore, ['pages', 'currentPage']),
    canGoBack() {
      return this.checkHistory('back')
    },
    canGoForward() {
      return this.checkHistory('forward')
    },
  },
  methods: {
    ...mapActions(useHistoryStore, ['reload', 'forward', 'back']),
    checkHistory(direction) {
      if (!direction || !this.pages) throw new Error('Missing inputs')

      let nextPageIndex

      switch (direction) {
        case 'back':
          nextPageIndex = this.pages[this.currentPage.index - 1]
          break

        case 'forward':
          nextPageIndex = this.pages[this.currentPage.index + 1]
          break
      }

      if (
        this.pages.length > 0 &&
        this.currentPage.index !== nextPageIndex &&
        typeof nextPageIndex !== 'undefined'
      ) {
        return true
      } else {
        return false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.controls {
  display: flex;
  margin-right: 1rem;
}
</style>
