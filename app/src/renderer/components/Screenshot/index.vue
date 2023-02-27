<template>
  <div id="screenshots">
    <!-- One selected -->
    <transition name="slide-fade">
      <div v-if="selectedArtboards.list.length > 0" class="modal">
        <div>
          <Button role="primary" @click="screenshotSelected">
            Save
            {{
              selectedArtboards.list.length > 1
                ? selectedArtboards.list.length + ' images...'
                : selectedArtboards.list.length + ' image...'
            }}
          </Button>
          <Button
            v-if="selectedArtboards.list.length === 1"
            role="secondary"
            @click="copyToClipboard()"
          >
            Copy to Clipboard
          </Button>
          <Button
            v-if="selectedArtboards.list.length >= 1"
            role="secondary"
            @click="deleteMultiple()"
          >
            Delete selected
          </Button>
          <!-- <Button
            v-if="selectedArtboards.list.length === 1"
            role="secondary"
            @click="copyToClipboard"
            >Run Cross-browser</Button
          > -->
          <!-- Toggle fullPage screenshots on/off -->
          <div class="screenshot-settings">
            <label
              @mouseover="showFullPreviews()"
              @mouseout="
                state.captureFullPage === false ? hideFullPreviews() : ''
              "
            >
              <input
                type="radio"
                v-model="state.captureFullPage"
                :value="true"
              />
              Full page
            </label>
            <label>
              <input
                type="radio"
                v-model="state.captureFullPage"
                :value="false"
              />
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

<script setup lang="ts">
import { computed, reactive } from 'vue'
import * as capture from './capture'
import { useArtboardsStore } from '~/store/artboards'
import { useSelectedArtboardsStore } from '~/store/selectedArtboards'

const artboards = useArtboardsStore()
const selectedArtboards = useSelectedArtboardsStore()

interface IPrevArtboardHeights {
  height: number
  id: string
}

const data = reactive({
  filePath: '',
  prevArtboardHeights: <IPrevArtboardHeights[]>[], // { height: 200, id: 'abc123' }
  artboards: computed(() => artboards.list),
})

const state = reactive({
  isScreenshotMode: false,
  captureFullPage: false,
})

async function clearAllSelected() {
  // Clear all selected artboards
  selectedArtboards.empty()

  // Revert any artboard heights to their original values
  await hideFullPreviews()
}

async function screenshotAll() {
  try {
    await capture.captureAll(this)
  } catch (err) {
    throw new Error(err)
  }
}

async function screenshotSelected() {
  try {
    await capture.captureMultiple(selectedArtboards.list)
  } catch (err) {
    throw new Error(err)
  }
}

async function copyToClipboard() {
  // TODO This is a hacky way to handle just getting one selected artboard (which is required for clipboard image copying)
  const isArtboardInViewport = artboards.isArtboardInViewport(
    selectedArtboards.list[0]
  )

  if (!isArtboardInViewport) {
    console.warn('Artboard is not in viewport')
    return false
  }

  await capture
    .copyToClipboard(selectedArtboards.list, {
      fullPage: state.captureFullPage,
      isArtboardInViewport,
    })
    .catch((err) => console.error(err))
  // TODO Notify the user when the image has been saved to clipboard
  // TODO Notify the user if there's an error copying to clipboard
}

// TODO should show a preview for one specific artboard
// async showFullPreview(id) {
//   const webviewEl = capture.getWebview(id)
//   const webviewElContents = capture.getWebViewContents(id)
//   const tempHeight = await webviewElContents.executeJavaScript(
//     `(() => ( document.body.offsetHeight ))()`
//   )

//   // Store the previous height
//   data.prevArtboardHeights.push({
//     id,
//     height: parseInt(webviewEl.style.height, 10),
//   })

//   // Temporarily expand the height of the artboard
//   const artboard = data.artboards.find((artboard) => artboard.id === id)
//   this.$store.dispatch('artboards/resizeArtboard', {
//     ...artboard,
//     height: tempHeight,
//   })
// },

async function showFullPreviews() {
  // Loop through each artboard
  for (const id of selectedArtboards.list) {
    const webviewEl = capture.getWebview(id)
    const webviewElContents = capture.getWebViewContents(id)
    const tempHeight = await webviewElContents.executeJavaScript(
      `(() => ( document.body.offsetHeight ))()`
    )

    // Store the previous height
    data.prevArtboardHeights.push({
      id,
      height: parseInt(webviewEl.style.height, 10),
    })

    // Temporarily expand the height of the artboard
    const artboard = artboards.list.find((artboard) => artboard.id === id)
    artboards.resizeArtboard({
      ...artboard,
      height: tempHeight,
    })
  }
}

async function hideFullPreviews() {
  // Loop through each artboard
  for (const id of selectedArtboards.list) {
    const webviewEl = capture.getWebview(id)
    const webviewElContents = capture.getWebViewContents(id)
    const tempHeight = await webviewElContents.executeJavaScript(
      `(() => ( document.body.offsetHeight ))()`
    )

    // Revert to original height
    const { height: prevHeight } = data.prevArtboardHeights.find(
      (artboard) => artboard.id === id
    )
    const artboard = data.artboards.find((artboard) => artboard.id === id)

    // Remove last height from array
    data.prevArtboardHeights = data.prevArtboardHeights.filter(
      (artboard) => artboard.id !== id
    )

    // Commit
    artboards.resizeArtboard({
      ...artboard,
      height: prevHeight,
    })
  }
}

async function deleteMultiple() {
  for (const id of selectedArtboards.list) {
    selectedArtboards.remove({ id })
  }
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
