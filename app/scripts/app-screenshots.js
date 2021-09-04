const { _electron: electron } = require('playwright')

;(async () => {
  // Launch Electron app.
  const electronApp = await electron.launch({
    args: ['./dist/main/index.js'],
  })

  // Evaluation expression in the Electron context.
  const appPath = await electronApp.evaluate(async ({ app }) => {
    // This runs in the main Electron process, parameter here is always
    // the result of the require('electron') in the main app script.
    return app.getAppPath()
  })

  // Get the first window that the app opens, wait if necessary
  const window = await electronApp.firstWindow()

  // Direct Electron console to Node terminal
  window.on('console', console.log)

  // Capture a screenshot
  await window.screenshot({ path: 'screenshot.png' })

  // Exit app
  await electronApp.close()
})()
