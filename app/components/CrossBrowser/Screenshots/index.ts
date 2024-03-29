import { reactive, watchEffect } from 'vue'
import { app } from '@electron/remote'
import { ipcRenderer } from 'electron';

import { BrowserName } from '@/electron/cross-browser/playwright-browser-manager'

// Expose the Web Worker using Comlink (via Vite plugin)
// const { CrossBrowserScreenshot } = new ComlinkWorker<
//   typeof import('./playwright.worker')
// >(new URL('./playwright.worker', import.meta.url), {})


// Keep track of all the open browser contexts
// This data can be accessed reactively
export const browserContexts = reactive({
  active: [],
})

// Log changes to the browser contextss
watchEffect(() => console.log('browser context change', browserContexts.active))

export async function takeScreenshots(
  { url = '', browsers = [], height = 0, width = 0, x = 0, y = 0 },
  callback = () => { }
) {
  const screenshotPromiseGenerator = async (browserName: BrowserName) => {
    // Call the `main` process to launch the browser
    const instance = await ipcRenderer.invoke('cb-instance', { url, browser: browserName, isPackaged: app.isPackaged })

    console.log('browser instance', instance);

    const { contextId } = instance

    const screenshots = await ipcRenderer.invoke('cb-screenshot', {
      contextId,
      options: {
        browser: browserName,
        url,
        x,
        y,
        height, width
      }
    })

    return { type: browserName, img: screenshots }

    // try {
    //   // Track the context
    //   // browserContexts.active.push({ id: contextId, type: browserName })

    //   // Take the screenshot
    //   // const screenshots = await instance.takeScreenshot()

    //   // Stop tracking this context
    //   // removeBrowserContext(contextId)

    //   return { type: browserName, img: screenshots }
    // } catch (err) {
    //   removeBrowserContext(contextId)
    //   console.error(err)
    // }

    // Remove this ID from the list of active
    // function removeBrowserContext(id) {
    //   browserContexts.active = browserContexts.active.filter(
    //     (i) => !i.id === id
    //   )
    // }
  }

  // Loop through each browser
  // Store a promise for each browser
  const promises = browsers.map(screenshotPromiseGenerator)

  // Trigger callback (optional) every time one finishes
  promises.forEach((promise) => {
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

// A single browser's screenshot
// class CrossBrowserScreenshot {
//   constructor(options) {
//     this.url = options.url || 'https://google.com'
//     this.browser = ['chromium', 'webkit', 'firefox'].includes(options.browser)
//       ? options.browser
//       : 'chromium' // Default to Chromium
//     this.height = options.height || 100
//     this.width = options.width || 100
//     this.x = options.x || 0
//     this.y = options.y || 0

//     this.isLoading = true // Initial state
//   }

//   async takeScreenshot() {
//     const id = uuid()
//     console.log(`Preparing to launch ${this.browser}, ${id}`)
//     this.isLoading = true // Update loading state

//     const browser = await playwright[this.browser].launch({
//       /* headless: false */
//     })
//     const context = await browser.newContext({
//       viewport: {
//         height: this.height,
//         width: this.width,
//       },
//     })

//     // Track the context
//     browserContexts.active.push({ id, context, type: this.browser })

//     // Remove this ID from the list of active
//     function removeBrowserContext(id) {
//       browserContexts.active = browserContexts.active.filter(
//         (i) => !i.id === id
//       )
//     }

//     try {
//       console.log(`Loading ${this.browser}, ${id}`)

//       const page = await context.newPage()
//       await page.goto(this.url, {
//         // waitUntil: 'networkidle',
//       })

//       console.log('x,y', [this.x, this.y])

//       // Scroll up/down as needed
//       await page.evaluate(`window.scrollTo(${this.x}, ${this.y})`)

//       // Wait...
//       await page.waitForTimeout(1000)

//       const screenshotBuffer = await page.screenshot({
//         //   clip: {
//         //     x: 0,
//         //     y: 0,
//         //     height: this.height,
//         //     width: this.width,
//         //   },
//       })

//       removeBrowserContext(id) // Remove from the array of active browsers
//       await browser.close()

//       return screenshotBuffer
//     } catch (err) {
//       this.isLoading = false
//       removeBrowserContext(id)
//       await browser.close()
//       console.log(err)
//       return false
//     }
//   }
// }
