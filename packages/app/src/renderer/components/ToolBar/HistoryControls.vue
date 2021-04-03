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

<script>
import { mapActions, mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      pages: state => state.history.pages,
      currentPage: state => state.history.currentPage.index,
      history: state => state.history
    }),
    canGoBack () {
      return this.checkHistory('back')
    },
    canGoForward () {
      return this.checkHistory('forward')
    }
  },
  methods: {
    ...mapActions('history', ['reload', 'forward', 'back']),
    checkHistory (direction) {
      if (!direction || !this.pages) throw new Error('Missing inputs')

      let nextPageIndex

      switch (direction) {
      case 'back':
        nextPageIndex = this.pages[this.currentPage - 1]
        break

      case 'forward':
        nextPageIndex = this.pages[this.currentPage + 1]
        break
      }

      if (
        this.pages.length > 0 &&
        this.currentPage !== nextPageIndex &&
        typeof nextPageIndex !== 'undefined'
      ) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.controls {
  display: flex;
  margin-right: 1rem;
}
</style>
