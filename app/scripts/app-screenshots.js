const { _electron: electron } = require('playwright')
const fs = require('fs')
const path = require('path')

;(async () => {
  const buildFilePath = path.resolve(__dirname, '../dist/main/index.js')

  // Dependency: Check if the file has been built
  const appHasBuilt = ifFileExists(buildFilePath)

  if (appHasBuilt) {
    // Launch Electron app.
    const electronApp = await electron.launch({
      args: [buildFilePath],
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
  } else {
    console.error(
      'The app has not yet been built. Please build the app first: yarn run dev.'
    )
  }
})()

function ifFileExists(filePath) {
  return fs.promises
    .access(filePath, fs.F_OK)
    .then(() => true)
    .catch(() => false)
}
