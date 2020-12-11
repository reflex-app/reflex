// This file handles the state and features of the UI for taking screenshots
import { reactive, watchEffect } from '@vue/composition-api'
import {
  takeScreenshots,
  toBase64Image,
} from '~/components/CrossBrowser/Screenshots'

export default function useCrossBrowserScreenshots() {
  const state = reactive({
    isLoading: false,
    screenshots: [],
    browsers: ['firefox', 'webkit'],
  })

  async function takeCrossBrowserScreenshot({
    url,
    browsers = state.browsers,
    height,
    width,
    x,
    y,
  }) {
    state.isLoading = true // Update loading state
    state.screenshots = [] // empty it out

    // Add a temporary frame for each browser
    // showSkeletonLoader(browsers.length)

    // Render the image to the front-end as it loads
    const renderImage = (screenshot) => {
      if (!screenshot) return false
      console.log(screenshot)
      screenshot.img = toBase64Image(screenshot.img) // Convert buffer to base64
      state.screenshots.push(screenshot) // Add in "real-time"
      return true
    }

    // Return the screenshot to the frame
    await takeScreenshots(
      {
        url,
        browsers,
        height,
        width,
        x,
        y,
      },
      renderImage
    )

    // Update loading state
    state.isLoading = false

    // Hide the skeleton loader
    // hideSkeletonLoader(browsers.length)
  }

  return {
    state,
    takeCrossBrowserScreenshot,
  }
}
