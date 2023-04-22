import path from 'path'
import isDev from 'electron-is-dev'
import { autoUpdater } from 'electron-updater'
import { reactive } from '@vue/reactivity' // Use Vue's reactivity system
import { reset as resetCheckForUpdate } from './check-for-update'
import { dialog, ipcMain, app, BrowserWindow } from 'electron'
import log from 'electron-log'

// Shared state
export const state = reactive({
  checkType: 'auto', // Either 'auto' or 'menu'
  updateAvailable: false,
  updateDownloaded: false,
})

export function init(window) {
  if (isDev) {
    // Useful for some dev/debugging tasks, but download can
    // not be validated becuase dev app is not signed
    // To test it out, change package.json version to a previous version
    autoUpdater.updateConfigPath = path.join(
      __dirname,
      '../../../../build/dev-app-update.yml'
    )

    // Force the updater to work in “dev” mode, looking for “dev-app-update.yml” instead of “app-update.yml"
    // Docs: https://www.electron.build/api/electron-builder.html#AppUpdater-forceDevUpdateConfig
    autoUpdater.forceDevUpdateConfig = true
  }

  // Disable auto-downloading
  autoUpdater.autoDownload = false

  // Set update type to "auto" (auto-update)
  state.checkType = 'auto'

  // Using a prerelease version will depend on the current package.json version
  // If the current version includes "-beta" or "-alpha", those will be searched for.
  // Don't set this. Allow electron-builder to do the work.
  // See: https://www.electron.build/auto-update#AppUpdater-allowPrerelease
  // autoUpdater.allowPrerelease = true

  // Channel for updates
  // Default is latest non-preview (not beta, not alpha)
  // channel String - Get the update channel.
  // Not applicable for GitHub. Doesn’t return channel from the update configuration, only if was previously set.

  // NOTE: Autoupdater does NOT have a channel concept for Github
  // let currChannel = autoUpdater.channel ? autoUpdater.channel : 'latest'
  // So... we roll our own
  const channels = ['latest', 'beta', 'alpha']
  const version = app.getVersion()
  let currChannel =
    channels.find((channel) => version.includes(channel)) || 'latest'
  autoUpdater.channel = currChannel
  console.log('Release channel:', currChannel)

  // Listen for requests for current channel
  ipcMain.on('get-autoupdate-channel', (event, arg) => {
    event.reply('get-autoupdate-channel-response', currChannel)
  })

  // Listen for requests to change download channel
  ipcMain.on('set-autoupdate-channel', (event, channel) => {
    if (
      ['latest', 'beta', 'alpha'].includes(channel) &&
      currChannel !== channel
    ) {
      // Set the new value
      autoUpdater.channel = channel
      currChannel = channel
      console.info(`Set channel to ${autoUpdater.channel}`)
      event.reply('set-autoupdate-channel-response', channel)

      // Restart with the new version
      // NOTE: Does not work in dev mode
      // autoUpdater.quitAndInstall()
      console.info('Checking for updates...')
      autoUpdater.checkForUpdates()
    } else {
      console.error(
        `Incorrect autoupdate channel set or value has not changed: ${channel}`
      )
      return false
    }
  })

  // Check for updates
  autoUpdater.checkForUpdates()

  autoUpdater.on('checking-for-update', () => {
    console.info('Checking for update...')
  })

  // Listen for when an update is available
  autoUpdater.on('update-available', async (updateInfo) => {
    // Update state
    state.updateAvailable = true

    // Prompt user
    await dialog
      .showMessageBox({
        type: 'info',
        title: 'Found Updates',
        message: `An update to ${updateInfo.version} is available.\n\n Do you want update and restart the app now?`,
        buttons: ['No', 'Yes'],
        defaultId: 1,
      })
      .then(async ({ response }) => {
        console.log('response', response)
        if (response === 1) {
          await autoUpdater.downloadUpdate()

          // Update state
          state.updateDownloaded = true
        } else {
          // Reset the menu item's state
          resetCheckForUpdate()
        }
      })
  })

  autoUpdater.on('update-not-available', (info) => {
    state.updateAvailable = false
  })

  /**
   * Listen for user to click on the
   * install button --> install & restart
   */
  ipcMain.on('TRIGGER_INSTALL', () => {
    if (state.updateAvailable === true) {
      installAndRestart()
    } else {
      // eslint-disable-next-line no-console
      console.warn('No update available')
    }
  })

  // Tracking the progress
  // (All of this is sent to the renderer)
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
    sendStatusToWindow(logMessage)

    // Send the current progress to our IPC window
    window.webContents.send('DOWNLOAD_PROGRESS', progressObj.percent)
  })

  /**
   * Downloaded!
   */
  autoUpdater.on('update-downloaded', () => {
    state.updateDownloaded = true
    log.info('update downloaded')
    sendStatusToWindow('Update downloaded')
    window.webContents.send('DOWNLOAD_PROGRESS', 100) // Notify the FE if already installed

    if (state.checkType === 'auto') {
      // Install and restart
      installAndRestart()
    }
  })

  /**
   * Handle errors
   */
  autoUpdater.on('error', (err) => {
    log.info('error in auto-updater', err)
    sendStatusToWindow('Error in auto-updater. ' + err)
  })

  function sendStatusToWindow(text) {
    window.send('message', text)
  }

  function installAndRestart() {
    setImmediate(() => {
      ensureSafeQuitAndInstall()
      // Windows: Install silently and restart
      autoUpdater.quitAndInstall(false, false)
    })
  }
}

/**
 * ensureSafeQuitAndInstall
 * Make sure Electron quits properly
 * https://github.com/electron-userland/electron-builder/issues/1604#issuecomment-372091881
 */
function ensureSafeQuitAndInstall() {
  app.removeAllListeners('window-all-closed')
  const browserWindows = BrowserWindow.getAllWindows()
  browserWindows.forEach((browserWindow) => {
    browserWindow.removeAllListeners('close') // Remove listeners
  })
}
