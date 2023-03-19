/**
 * Provides a menu item to check for updates manually
 */
import { dialog } from 'electron'
import { autoUpdater } from 'electron-updater'
import isDev from 'electron-is-dev'

let updater = {}

export function init() {
  autoUpdater.on('error', (error) => {
    dialog.showErrorBox(
      'Error: ',
      error == null ? 'unknown' : (error.stack || error).toString()
    )
  })

  autoUpdater.on('update-available', (updateInfo) => {
    dialog
      .showMessageBox({
        type: 'info',
        title: 'Found Updates',
        message: `An update to ${updateInfo.version} is available.\n\n Do you want update and restart the app now?`,
        buttons: ['Yes', 'No'],
      })
      .then(async ({ response }) => {
        console.log('response', response)
        if (response === 0) {
          await autoUpdater.downloadUpdate()
        } else {
          updater.enabled = true
          updater = null
        }
      })
  })

  autoUpdater.on('update-not-available', () => {
    dialog.showMessageBox({
      title: 'No Updates',
      message: 'Current version is up-to-date.',
    })

    updater.enabled = true
    updater = null
  })

  autoUpdater.on('download-progress', (progressObj) => {
    let logMessage = 'Download speed: ' + progressObj.bytesPerSecond
    logMessage = logMessage + ' - Downloaded ' + progressObj.percent + '%'
    logMessage =
      logMessage +
      ' (' +
      progressObj.transferred +
      '/' +
      progressObj.total +
      ')'

    // Log the progress
    console.info(logMessage)
  })

  autoUpdater.on('update-downloaded', () => {
    dialog
      .showMessageBox({
        title: 'Install Updates',
        message: 'Updates downloaded, application will restart...',
      })
      .then(() => {
        if (isDev) {
          console.log(
            'App would now restart and install the update in production mode'
          )
        }

        // Quit and restart the app with the update
        if (!isDev) {
          setImmediate(() => autoUpdater.quitAndInstall())
        }
      })
  })
}

// export this to MenuItem click callback
export async function checkForUpdates(menuItem) {
  updater = menuItem
  updater.enabled = false

  // Disable auto download
  autoUpdater.autoDownload = false

  // Initialize listeners
  init()

  // Check for updates
  await autoUpdater.checkForUpdates()
}
