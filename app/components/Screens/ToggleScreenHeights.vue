<template>
  <div
    v-if="artboards.list.length > 0 && history.currentPage.url"
    class="screenshot-settings border-b border-gray-300 py-2 px-4 flex gap-4"
  >
    <label>
      <input type="radio" v-model="gui.isScreensFullHeight" :value="true" />
      Full height
    </label>
    <label>
      <input type="radio" v-model="gui.isScreensFullHeight" :value="false" />
      Viewport
    </label>
  </div>
</template>

<script setup lang="ts">
import * as capture from '~/components/Screenshot/capture'
import { useArtboardsStore } from '~/store/artboards'
import { useGuiStore } from '~/store/gui'
import { useHistoryStore } from '@/store/history'

const artboards = useArtboardsStore()
const gui = useGuiStore()
const history = useHistoryStore()

interface IPrevArtboardHeights {
  height: number
  id: string
}

const data = reactive({
  filePath: '',
  prevArtboardHeights: new Set<IPrevArtboardHeights>(), // { height: 200, id: 'abc123' }
  artboards: computed(() => artboards.list),
})

watchEffect(() => {
  if (gui.isScreensFullHeight) {
    showFullPreviews()
  } else {
    hideFullPreviews()
  }
})

async function showFullPreviews() {
  await Promise.all(
    data.artboards.map(async (artboard) => {
      // 1. Execute some JS inside the webview to get the height of the page
      const webviewEl = capture.getWebview(artboard.id)
      const webviewElContents = capture.getWebViewContents(artboard.id)
      const fullHeight: number = await webviewElContents?.executeJavaScript(
        `(() => ( document.body.offsetHeight ))()`
      )

      if (!webviewElContents) {
        console.warn('No webview contents found for artboard', artboard)
        return
      }

      // 2. Update the Store
      const match = artboards.list.find((i) => i.id === artboard.id)
      if (!match) {
        console.warn('No match found for artboard', artboard)
        return
      }

      // Save the fullHeight to the Store
      artboards.updateArtboardAtIndex({ ...match, fullHeight: fullHeight })

      // Modify the height to be the full height
      artboards.setArtboardFullHeight({ id: match.id })

      // Return a promise that resolves when the artboard's full height is set in the store
      return new Promise<void>((resolve) => {
        let timeoutId: ReturnType<typeof setTimeout>
        const intervalId = setInterval(() => {
          const updatedArtboard = artboards.list.find(
            (i) => i.id === artboard.id
          )
          if (updatedArtboard?.height === updatedArtboard?.fullHeight) {
            clearInterval(intervalId)
            clearTimeout(timeoutId)
            resolve()
          }
        }, 100)

        timeoutId = setTimeout(() => {
          clearInterval(intervalId)
          resolve()
        }, 8000)
      })
    })
  )
}

async function hideFullPreviews() {
  for (const artboard of data.artboards) {
    const match = artboards.list.find((i) => i.id === artboard.id)
    if (!match) {
      console.warn('No match found for artboard', artboard)
      return
    }

    artboards.setArtboardViewportHeight({ id: match.id })
  }
}
</script>

<style scoped></style>
