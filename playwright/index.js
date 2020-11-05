const playwright = require('playwright')

;(async () => {
  for (const browserType of ['chromium', 'firefox', 'webkit']) {
    const browser = await playwright[browserType].launch()
    const context = await browser.newContext()
    const page = await context.newPage()
    await page.goto(
      'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date'
    )
    await page.screenshot({ path: __dirname + `/example-${browserType}.png` })
    await browser.close()
  }
})()
