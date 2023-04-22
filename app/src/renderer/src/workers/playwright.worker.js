// This all runs within a Web Worker
// ... but it's special because it has access to the Node modules because of Electron!
// We have access to the process.env
// We can use Node packages

import path from 'path'
import { v1 as uuid } from 'uuid'
import playwright from 'playwright-core'

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
    this.isPackaged = options.isPackaged || false // Whether or not the app is packaged or in dev TODO Deprecate this and handle without needing Remote
  }

  async takeScreenshot() {
    console.info(
      `Preparing to launch ${this.browser}, ${this.contextId}`,
      `Packaged? ${this.isPackaged}`
    )

    this.isLoading = true // Update loading state

    const browser = await playwright[this.browser].launch({
      /* headless: false */
      executablePath: getPlaywrightExecPath(this.isPackaged, this.browser), // Replace the path when packaged (ASAR)
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

// Amend the Playwright executable path when run locally and packaged
// It does not actually get installed at playwright-core
// via https://github.com/puppeteer/puppeteer/issues/2134#issuecomment-408221446
function getPlaywrightExecPath(isPackaged = false, browser) {
  if (!browser) console.error('No browser name given.')

  function replaceAll(str, mapObj) {
    const strToReplace = new RegExp(Object.keys(mapObj).join('|'))
    return str.replace(strToReplace, (matched) =>
      path.normalize(mapObj[matched.toLowerCase()])
    )
  }

  // Replace based on environment
  // When packaged, the app path gets packaged in ASAR and is unpacked
  // Packaged example: /Users/Jon/Sites/reflex/build/mac/Reflex.app/Contents/Resources/app.asar/dist/renderer/_nuxt/.local-browsers/webkit-1402/pw_run.sh
  const envReplacements = isPackaged
    ? {
        'app.asar/dist/renderer/_nuxt/':
          'app.asar.unpacked/node_modules/reflex-browser-installer/dist/',
      }
    : {
        'playwright-core': 'reflex-browser-installer/dist',
      }

  // Generate the correct paths
  const initialPath = playwright[browser].executablePath()
  const updatedPath = replaceAll(initialPath, envReplacements)
  initialPath === updatedPath
    ? console.error(
        `Exec. path was NOT changed: ${updatedPath}. Env: ${process.env.PLAYWRIGHT_BROWSERS_PATH}`
      )
    : console.info('Exec. path changed', { initialPath, updatedPath })

  return updatedPath
}
