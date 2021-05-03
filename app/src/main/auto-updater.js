const path = require('path')
const log = require('electron-log')
const { ipcMain, app, BrowserWindow } = require('electron')
const { autoUpdater } = require('electron-updater')
const isDev = require('electron-is-dev')

export default function init(window) {
  let UPDATE_AVAILABLE = null
  const win = window.webContents

  // Configure autoupdater
  // https://www.electron.build/auto-update#api
  autoUpdater.logger = log
  autoUpdater.logger.transports.file.level = 'debug'
  autoUpdater.allowPrerelease = true

  if (isDev) {
    // Useful for some dev/debugging tasks, but download can
    // not be validated becuase dev app is not signed
    autoUpdater.updateConfigPath = path.join(
      __dirname,
      '../../build/dev-app-update.yml'
    )

    // To test it out, change package.json version to a previous version
  }

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

  function sendStatusToWindow(text) {
    win.send('message', text)
  }

  win.on('did-finish-load', () => {
    // Check for updates
    autoUpdater.checkForUpdates()
  })

  autoUpdater.on('checking-for-update', () => {
    log.info('checking for update')
    sendStatusToWindow('Checking for update...')
  })

  autoUpdater.on('update-not-available', (info) => {
    log.info('update not available')
    sendStatusToWindow('Update not available.')
    UPDATE_AVAILABLE = false
  })

  // We can now know if there's an available update
  autoUpdater.on('update-available', (info) => {
    log.info('update available')
    sendStatusToWindow('Update available.')
    UPDATE_AVAILABLE = true
  })

  // Tracking the progress
  // (All of this is sent to the renderer)
  autoUpdater.on('download-progress', (progressObj) => {
    log.info('download-progress')

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
  autoUpdater.on('update-downloaded', (info) => {
    log.info('update downloaded')
    sendStatusToWindow('Update downloaded')
  })

  /**
   * Listen for user to click on the
   * install button --> install & restart
   */
  ipcMain.on('TRIGGER_INSTALL', () => {
    if (UPDATE_AVAILABLE === true) {
      setImmediate(() => {
        ensureSafeQuitAndInstall()
        autoUpdater.quitAndInstall(false)
      })
    } else {
      // eslint-disable-next-line no-console
      console.log('No update available')
    }
  })

  /**
   * Handle errors
   */
  autoUpdater.on('error', (err) => {
    log.info('error in auto-updater')
    sendStatusToWindow('Error in auto-updater. ' + err)
  })
}

/**
 * ensureSafeQuitAndInstall
 * Make sure Electron quits properly
 * https://github.com/electron-userland/electron-builder/issues/1604#issuecomment-372091881
 */
function ensureSafeQuitAndInstall() {
  app.removeAllListeners('window-all-closed')
  const browserWindows = BrowserWindow.getAllWindows()
  browserWindows.forEach(function (browserWindow) {
    browserWindow.removeAllListeners('close')
  })
}
