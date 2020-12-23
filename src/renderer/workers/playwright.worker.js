// This all runs within a Web Worker
// ... but it's special because it has access to the Node modules because of Electron!
import playwright from 'playwright'
import { v1 as uuid } from 'uuid'

export class CrossBrowserScreenshot {
  constructor(options) {
    this.url = options.url || 'https://google.com'
    this.browser = ['chromium', 'webkit', 'firefox'].includes(options.browser)
      ? options.browser
      : 'chromium' // Default to Chromium
    this.height = options.height || 100
    this.width = options.width || 100
    this.x = options.x || 0
    this.y = options.y || 0
    this.isLoading = false // Initial state
    this.contextId = uuid() // the ID of this context
  }

  async takeScreenshot() {
    console.log(`Preparing to launch ${this.browser}, ${this.contextId}`)
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

    try {
      console.log(`Loading ${this.browser}, ${this.contextId}`)

      const page = await context.newPage()
      await page.goto(this.url, {
        // waitUntil: 'networkidle',
      })

      console.log('x,y', [this.x, this.y])

      // Scroll up/down as needed
      await page.evaluate(`window.scrollTo(${this.x}, ${this.y})`)

      // Wait...
      await page.waitForTimeout(1000)

      const screenshot = await page.screenshot({
        //   clip: {
        //     x: 0,
        //     y: 0,
        //     height: this.height,
        //     width: this.width,
        //   },
      })
      const screenshotBuffer = screenshot.toString('base64')

      await browser.close()
      return screenshotBuffer
    } catch (err) {
      this.isLoading = false
      await browser.close()
      console.log(err)
      return false
    }
  }
}
