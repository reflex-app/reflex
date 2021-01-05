// This all runs within a Web Worker
// ... but it's special because it has access to the Node modules because of Electron!
import path from 'path'
import playwright from 'playwright'
import { v1 as uuid } from 'uuid'
import log from 'electron-log'

export class CrossBrowserScreenshot {
  constructor(options) {
    options = options || {}
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
    this.isPackaged = options.isPackaged || false
  }

  async takeScreenshot() {
    log.info(
      `Preparing to launch ${this.browser}, ${this.contextId}`,
      `Packaged? ${this.isPackaged}`,
      {
        browsers:
          process.env.PLAYWRIGHT_BROWSERS_PATH === '0'
            ? path.join(
                '/path/to/project',
                '/node_modules/electron-playwright-browser-installer/dist/.local-browsers'
              ) // It's using the node_modules
            : process.env.PLAYWRIGHT_BROWSERS_PATH, // Otherwise should be a defined path
      }
    )
    this.isLoading = true // Update loading state

    const browser = await playwright[this.browser].launch({
      /* headless: false */
      executablePath: this.isPackaged
        ? getPackagedPlaywrightExecPath(this.browser)
        : '', // Replace the path when packaged (ASAR)
    })

    const context = await browser.newContext({
      viewport: {
        height: this.height,
        width: this.width,
      },
      // If there's issues launching a self-signed version of a browser...
      // see: https://github.com/microsoft/playwright/issues/802#issuecomment-581585593
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

// Amend the Playwright executable path when packaged
// via https://github.com/puppeteer/puppeteer/issues/2134#issuecomment-408221446
function getPackagedPlaywrightExecPath(browser) {
  function replaceAll(str, mapObj) {
    const re = new RegExp(Object.keys(mapObj).join('|'), 'gi')

    return str.replace(re, function (matched) {
      return mapObj[matched.toLowerCase()]
    })
  }

  const mapObj = {
    playwright: 'electron-playwright-browser-installer',
    'app.asar': 'app.asar.unpacked',
  }

  const initialPath = playwright[browser].executablePath()
  const updatedPath = replaceAll(initialPath, mapObj)
  console.log(
    'Is the path the same as initially?',
    initialPath === updatedPath,
    `Changed to: ${updatedPath}`
  )

  return updatedPath
}
