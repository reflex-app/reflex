// This file handles the state and features of the UI for taking screenshots
import { reactive } from '@vue/composition-api'
import {
  takeScreenshots,
  toBase64Image,
} from '~/components/CrossBrowser/Screenshots'

export default function useCrossBrowserScreenshots() {
  const state = reactive({
    isLoading: false, // All screens for this browser
    loading: [], // Tracks the currently loading IDs
    screenshots: [],
    browsers: ['firefox', 'webkit'],
  })

  const defaultParams = () => {
    return {
      url: 'http://google.com',
      browsers: ['firefox', 'webkit'],
      height: 0,
      width: 0,
      x: 0,
      y: 0,
    }
  }

  async function takeCrossBrowserScreenshot(params = defaultParams()) {
    state.isLoading = true // Update loading state
    state.loading = [] // empty it out
    state.screenshots = [] // empty it out

    // Add a placeholder for each browser
    for (const b of params.browsers) {
      state.loading.push(b)
    }

    // Each screenshot...
    return await takeScreenshots(
      params,
      // Callback function: Render each screenshot as it becomes available
      (screenshot) => {
        if (!screenshot) return false

        console.log(screenshot)
        screenshot.img = toBase64Image(screenshot.img) // Convert buffer to base64
        // screenshot.img = toBase64Image(screenshot.img) // Convert buffer to base64

        // Update loading state
        state.loading = state.loading.filter((item) => item !== screenshot.type) // remove this item
        screenshot.isLoading = false // End loading state

        // Return the screenshot to the frame
        state.screenshots.push(screenshot) // Add in "real-time"

        // Update loading state
        state.isLoading = false

        // Respond to callback
        return true
      }
    )
  }

  return {
    state,
    takeCrossBrowserScreenshot,
  }
}
