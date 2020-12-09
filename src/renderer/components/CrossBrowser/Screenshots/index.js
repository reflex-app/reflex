import playwright from 'playwright'

// A single browser's screenshot
class CrossBrowserScreenshot {
  constructor(options) {
    this.url = options.url || 'https://google.com'
    this.browser = options.browser || 'chromium'
    this.height = options.height || 100
    this.width = options.width || 100
  }

  async takeScreenshot() {
    console.log(`Loading ${this.browser}`)
    const browser = await playwright[this.browser].launch()
    const context = await browser.newContext({
      viewport: {
        height: this.height,
        width: this.width,
      },
    })
    const page = await context.newPage()
    await page.goto(this.url)
    const screenshotBuffer = await page.screenshot({
      //   clip: {
      //     x: 0,
      //     y: 0,
      //     height: this.height,
      //     width: this.width,
      //   },
    })
    await browser.close()
    return screenshotBuffer
  }
}

export async function takeScreenshots(
  url,
  browsers = ['chromium', 'firefox', 'webkit'],
  height,
  width
) {
  const arr = []

  // Loop through each browser
  for (const browserType of browsers) {
    const browser = new CrossBrowserScreenshot({
      url: url,
      browser: browserType,
      height: height,
      width: width,
    })
    const screenshot = await browser.takeScreenshot()
    arr.push({ type: browserType, img: screenshot })
  }

  // Return an array of image buffers
  return arr
}

// Convert an image buffer into base64
export function toBase64Image(image) {
  const output = image.toString('base64')
  return `data:image/png;base64, ${output}`
}
