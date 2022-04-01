<template>
  <div>
    <div class="size-shifter-container">
      <div
        v-for="(item, index) in artboards"
        :key="item.id"
        ref="size-shifter-item"
        :screen-id="item.id"
        class="size-shifter-item"
        :class="{ 'is-active': item.id === focusModeActiveScreen.id }"
        :title="`Shortcut: ⌘${index + 1}`"
        @click="changeSize(item.id)"
      >
        <div class="number">{{ index + 1 }}</div>
        <div class="size">{{ item.width }}x{{ item.height }}</div>
      </div>
      <div ref="background-sliding-object" class="background-sliding-object" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      resizeTimer: null,
    }
  },
  computed: {
    ...mapState({
      focusModeActiveScreen: (state) => state.focusMode.activeScreen,
      focusModeScreens: (state) => state.focusMode.screens,
      artboards: (state) => state.artboards.list,
    }),
  },
  mounted() {
    this.enableListeners()

    // TODO Re-enable changing size on load
    // const activeScreen = this.focusModeActiveScreen

    // Start with the first item selected
    // const targetElement = document.querySelector(
    //   `[screen-id='${activeScreen.id}']`
    // )

    // TODO Bug when running this; component not loaded yet?
    // this.changeSize(activeScreen.id);
  },
  methods: {
    changeSize(id) {
      // Update size in Store
      this.$store.commit('focusMode/focusChangeActiveScreen', id)

      const index = this.getIndexFromId(this.focusModeActiveScreen.id)

      const slidingObject = this.$refs['background-sliding-object']
      const targetElement = this.$refs['size-shifter-item'][index]

      const currentOffsetLeft = slidingObject.offsetLeft
      const targetOffsetLeft = targetElement.offsetLeft
      const currentOffsetTop = slidingObject.offsetTop
      const targetOffsetTop = targetElement.offsetTop

      // Move the sliding object along X axis
      const newX = targetOffsetLeft - currentOffsetLeft
      const newY = targetOffsetTop - currentOffsetTop
      slidingObject.style.transform = `translate3d(${newX}px, ${newY}px, 0)`
      slidingObject.style.width = `${targetElement.offsetWidth}px`
      slidingObject.style.height = `${targetElement.offsetHeight}px`
    },
    /**
     * Get the index, given the ID
     * @param {String} id UUID
     */
    getIndexFromId(id) {
      const nodes = Array.from(document.querySelectorAll('[screen-id]'))
      const index = nodes.indexOf(document.querySelector(`[screen-id='${id}']`))
      return index
    },
    /**
     * Return the ID (String) of a screen, given the index
     * @param {Number} index
     */
    getIdFromIndex(index) {
      // NOTE: this is 0-indexed (-1)
      const item = document.querySelectorAll('[screen-id]')[index - 1]
      const id = item.getAttribute('screen-id')
      return id
    },
    enableListeners() {
      window.addEventListener('keydown', this.keyupHandler)
      window.addEventListener('resize', this.resizeHandler)

      this.$once('hook:beforeDestroy', () => {
        window.removeEventListener('keydown', this.keyupHandler)
        window.removeEventListener('resize', this.resizeHandler)
      })
    },
    keyupHandler(event) {
      const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9]

      // If Control or Command key is pressed and a key is pressed
      if ((event.ctrlKey || event.metaKey) && keys.includes(event.key)) {
        console.log('Control or Command key pressed')
        const id = this.getIdFromIndex(event.key)
        this.changeSize(id)
      }
    },
    resizeHandler() {
      // Only calls after resize event stops
      // via http://bencentra.com/code/2015/02/27/optimizing-window-resize.html
      clearTimeout(this.resizeTimer)

      this.resizeTimer = setTimeout(() => {
        this.changeSize(this.focusModeActiveScreen.id)
      }, 50)
    },
  },
}
</script>

<style lang="scss" scoped>
.size-shifter-container {
  display: flex;
  position: relative;
  overflow: auto;
  background: rgba(#e0e0e0, 0.5);
  border-radius: 30px;
  user-select: none;
  font-size: 80%;
  align-items: center;
  position: relative;
  margin: 1rem;
  // z-index: 1;
  backdrop-filter: blur(5px);

  // Small screens
  @media screen and (max-width: 1000px) {
    flex-direction: column;
    width: auto;
    display: inline-flex;
    border-radius: 20px;
  }
}

.size-shifter-item {
  position: relative;
  padding: 0.25rem 1.5rem;
  border: 1px solid transparent;
  border-radius: 30px;
  cursor: pointer;
  text-align: center;
  z-index: 1;
  opacity: 0.4;
  transition: opacity ease-in-out 125ms;

  .number {
    color: gray;
  }

  &.is-active {
    opacity: 1;
  }
}

.background-sliding-object {
  position: absolute;
  top: 0;
  left: 0;
  content: '';
  background: white;
  border: 1px solid #858585;
  width: 10px;
  height: 100%;
  transition: all 150ms ease-in-out;
  pointer-events: none;
  border-radius: 30px;
  z-index: 0;
}
</style>
