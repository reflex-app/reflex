<template>
  <div id="screenshots">
    <!-- One selected -->
    <transition name="slide-fade">
      <div v-if="selectedArtboards.length > 0" class="modal">
        <div>
          <Button role="primary" @click="screenshotSelected">
            Save
            {{
              selectedArtboards.length > 1
                ? selectedArtboards.length + ' images...'
                : selectedArtboards.length + ' image...'
            }}
          </Button>
          <Button
            v-if="selectedArtboards.length === 1"
            role="secondary"
            @click="copyToClipboard()"
          >
            Copy to Clipboard
          </Button>
          <Button
            v-if="selectedArtboards.length >= 1"
            role="secondary"
            @click="deleteMultiple()"
          >
            Delete selected
          </Button>
          <!-- <Button
            v-if="selectedArtboards.length === 1"
            role="secondary"
            @click="copyToClipboard"
            >Run Cross-browser</Button
          > -->
          <!-- Toggle fullPage screenshots on/off -->
          <div class="screenshot-settings">
            <label
              @mouseover="showFullPreviews()"
              @mouseout="captureFullPage === false ? hideFullPreviews() : ''"
            >
              <input type="radio" v-model="captureFullPage" :value="true" />
              Full page
            </label>
            <label>
              <input type="radio" v-model="captureFullPage" :value="false" />
              Visible
            </label>
          </div>
        </div>
        <Button
          role="secondary"
          class="modal__close button"
          @click="clearAllSelected"
        >
          Clear Selection
        </Button>
      </div>
    </transition>

    <!-- TODO Show the file path in Finder -->
    <!-- <a href="#" @click="showInFinder()">Show in Finder</a> -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
import * as capture from './capture'

export default {
  name: 'Screenshots',

  data() {
    return {
      isScreenshotMode: false,
      filePath: '',
      captureFullPage: false,
      prevArtboardHeights: [
        // { height: 200, id: 'abc123' }
      ],
    }
  },

  computed: {
    // Bind to our Vuex Store's URL value
    artboards() {
      return this.$store.state.artboards.list
    },
    selectedArtboards() {
      return this.$store.state.selectedArtboards
    },
    ...mapState({
      selectedArtboards: (state) => state.selectedArtboards,
    }),
  },

  methods: {
    async clearAllSelected() {
      // Clear all selected artboards
      this.$store.dispatch('selectedArtboards/selectedArtboardsEmpty')

      // Revert any artboard heights to their original values
      await this.hideFullPreviews()
    },

    async screenshotAll() {
      try {
        await capture.captureAll(this)
      } catch (err) {
        throw new Error(err)
      }
    },

    async screenshotSelected() {
      try {
        await capture.captureMultiple(this.selectedArtboards)
      } catch (err) {
        throw new Error(err)
      }
    },

    async copyToClipboard() {
      // TODO This is a hacky way to handle just getting one selected artboard (which is required for clipboard image copying)
      const isArtboardInViewport = this.$store.getters[
        'artboards/isArtboardInViewport'
      ](this.selectedArtboards[0])

      await capture.copyToClipboard(this.selectedArtboards, {
        fullPage: this.captureFullPage,
        isArtboardInViewport,
      })
      // TODO Notify the user when the image has been saved to clipboard
      // TODO Notify the user if there's an error copying to clipboard
    },

    // TODO should show a preview for one specific artboard
    // async showFullPreview(id) {
    //   const webviewEl = capture.getWebview(id)
    //   const webviewElContents = capture.getWebViewContents(id)
    //   const tempHeight = await webviewElContents.executeJavaScript(
    //     `(() => ( document.body.offsetHeight ))()`
    //   )

    //   // Store the previous height
    //   this.prevArtboardHeights.push({
    //     id,
    //     height: parseInt(webviewEl.style.height, 10),
    //   })

    //   // Temporarily expand the height of the artboard
    //   const artboard = this.artboards.find((artboard) => artboard.id === id)
    //   this.$store.dispatch('artboards/resizeArtboard', {
    //     ...artboard,
    //     height: tempHeight,
    //   })
    // },

    async showFullPreviews() {
      // Loop through each artboard
      for (const id of this.selectedArtboards) {
        const webviewEl = capture.getWebview(id)
        const webviewElContents = capture.getWebViewContents(id)
        const tempHeight = await webviewElContents.executeJavaScript(
          `(() => ( document.body.offsetHeight ))()`
        )

        // Store the previous height
        this.prevArtboardHeights.push({
          id,
          height: parseInt(webviewEl.style.height, 10),
        })

        // Temporarily expand the height of the artboard
        const artboard = this.artboards.find((artboard) => artboard.id === id)
        this.$store.dispatch('artboards/resizeArtboard', {
          ...artboard,
          height: tempHeight,
        })
      }
    },

    async hideFullPreviews() {
      // Loop through each artboard
      for (const id of this.selectedArtboards) {
        const webviewEl = capture.getWebview(id)
        const webviewElContents = capture.getWebViewContents(id)
        const tempHeight = await webviewElContents.executeJavaScript(
          `(() => ( document.body.offsetHeight ))()`
        )

        // Revert to original height
        const { height: prevHeight } = this.prevArtboardHeights.find(
          (artboard) => artboard.id === id
        )
        const artboard = this.artboards.find((artboard) => artboard.id === id)

        // Remove last height from array
        this.prevArtboardHeights = this.prevArtboardHeights.filter(
          (artboard) => artboard.id !== id
        )

        // Commit
        this.$store.dispatch('artboards/resizeArtboard', {
          ...artboard,
          height: prevHeight,
        })
      }
    },

    async deleteMultiple() {
      for (const id of this.selectedArtboards) {
        this.$store.dispatch('artboards/deleteArtboard', {
          id,
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/scss/_variables';

#screenshots {
  .modal {
    position: fixed;
    bottom: 2rem;
    margin: 0 auto;
    left: 0;
    right: 0;
  }
}

.screenshot-settings {
  padding: 0.5rem 0;
}

.modal {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 700px;
  background: white;
  padding: 1rem;
  z-index: 100;
  background: #ffffff;
  border: 1px solid #c8c8c8;
  border-radius: 4px;

  .modal__close {
    color: black;
    cursor: pointer;
  }
}

/* Enter and leave animations can use different */
/* durations and timing functions.              */
.slide-fade-enter-active {
  transition: all 300ms ease;
}
.slide-fade-leave-active {
  transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateY(4rem);
  opacity: 0;
}
</style>
