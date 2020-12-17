import playwright from 'playwright'
import { reactive, watchEffect } from '@vue/composition-api'
import { v1 as uuid } from 'uuid'

// Keep track of all the open browser contexts
// This data can be accessed reactively
export const browserContexts = reactive({
  active: [],
})

// Log changes to the browser contextss
watchEffect(() => console.log('browser', browserContexts.active))

// A single browser's screenshot
class CrossBrowserScreenshot {
  constructor(options) {
    this.url = options.url || 'https://google.com'
    this.browser = ['chromium', 'webkit', 'firefox'].includes(options.browser)
      ? options.browser
      : 'chromium' // Default to Chromium
    this.height = options.height || 100
    this.width = options.width || 100
    this.x = options.x || 0
    this.y = options.y || 0

    this.isLoading = true // Initial state
  }

  async takeScreenshot() {
    const id = uuid()
    console.log(`Preparing to launch ${this.browser}, ${id}`)
    this.isLoading = true // Update loading state

    const browser = await playwright[this.browser].launch({
      /* headless: false */
    })
    const context = await browser.newContext({
      viewport: {
        height: this.height,
        width: this.width,
      },
    })
    // Track the context
    browserContexts.active.push({ id, context, type: this.browser })

    try {
      console.log(`Loading ${this.browser}, ${id}`)

      const page = await context.newPage()
      await page.goto(this.url, {
        // waitUntil: 'networkidle',
      })

      console.log('x,y', [this.x, this.y])

      // Scroll up/down as needed
      await page.evaluate(`window.scrollTo(${this.x}, ${this.y})`)

      // Wait...
      await page.waitForTimeout(1000)

      const screenshotBuffer = await page.screenshot({
        //   clip: {
        //     x: 0,
        //     y: 0,
        //     height: this.height,
        //     width: this.width,
        //   },
      })

      // Remove from the array
      browserContexts.active = browserContexts.active.filter(
        (i) => !i.id === id
      ) // Remove this ID from the list of active
      await browser.close()

      return screenshotBuffer
    } catch (err) {
      this.isLoading = false
      console.log(err)
      await browser.close()
    }
  }
}

export async function takeScreenshots(
  { url = '', browsers = [], height = 0, width = 0, x = 0, y = 0 },
  callback = () => {}
) {
  // Loop through each browser
  const screenshotPromiseGenerator = (browser) => {
    return new Promise((resolve) => {
      const b = new CrossBrowserScreenshot({
        url,
        browser,
        height,
        width,
        x,
        y,
      })

      b.takeScreenshot().then((screenshot) => {
        resolve({ type: browser, img: screenshot })
      })
    })
  }

  // Loop through each browser
  // Store a promise for each browser
  const promises = browsers.map(screenshotPromiseGenerator)

  //  Trigger callback (optional) every time one finishes
  promises.forEach((promise) => {
    // Return the result
    promise.then((d) => {
      if (!d) return false
      console.log('browser finished', d)
      callback(d)
    })
  })

  // Wait until they all complete
  const data = await Promise.all(promises)
  console.log(data)
  return data
}

// Convert an image buffer into base64
export function toBase64Image(image) {
  const output = image.toString('base64')
  return `data:image/png;base64, ${output}`
}
