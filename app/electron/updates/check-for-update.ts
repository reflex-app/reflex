/**
 * Provides a menu item to check for updates manually
 */
import { dialog, MenuItem } from 'electron'
import { autoUpdater } from 'electron-updater'
import isDev from 'electron-is-dev'
import { state as appUpdateState } from './index'
import { computed } from '@vue/reactivity'

let updater: { enabled?: boolean } | null = {}
let isManualCheckUpdate = computed(() => appUpdateState.checkType === 'menu')

// export this to MenuItem click callback
export function checkForUpdates(menuItem: MenuItem) {
  // Set flag
  appUpdateState.checkType = 'menu'

  // Assign reference to the menu item, to enable/disable it
  updater = menuItem
  updater.enabled = false

  // Disable auto download
  autoUpdater.autoDownload = false

  // Initialize listeners
  initListeners()

  // Check for updates
  autoUpdater.checkForUpdates()
}

export function initListeners() {
  autoUpdater.on('error', (error) => {
    if (isManualCheckUpdate) {
      dialog.showErrorBox(
        'Error: ',
        error == null ? 'unknown' : (error.stack || error).toString()
      )
    }
  })

  autoUpdater.on('update-not-available', () => {
    if (isManualCheckUpdate) {
      dialog.showMessageBox({
        title: 'No Updates',
        message: 'Current version is up-to-date.',
      })

      reset()
    }
  })

  autoUpdater.on('update-downloaded', () => {
    if (isManualCheckUpdate) {
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
    }
  })
}

export function reset() {
  updater.enabled = true
  updater = null
}
