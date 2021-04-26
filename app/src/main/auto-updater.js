const log = require('electron-log')
const { ipcMain, app, BrowserWindow } = require('electron')
const { autoUpdater } = require('electron-updater')
const isDev = require('electron-is-dev')

autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'

export default function init(window) {
  let UPDATE_AVAILABLE = null
  const win = window.webContents

  // Channel for updates
  // Default is latest non-preview (not beta, not alpha)
  let currChannel = autoUpdater.channel ? autoUpdater.channel : 'latest'
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
      autoUpdater.quitAndInstall()
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
    if (isDev) {
      sendStatusToWindow(
        'Not checking for updates in dev mode, triggering example instead.'
      )
      win.send('DOWNLOAD_PROGRESS', '10')

      setTimeout(() => {
        win.send('DOWNLOAD_PROGRESS', '30')
      }, 3000)

      setTimeout(() => {
        win.send('DOWNLOAD_PROGRESS', '60')
      }, 5000)

      setTimeout(() => {
        win.send('DOWNLOAD_PROGRESS', '100')
      }, 7000)
    } else {
      // Check for updates
      autoUpdater.checkForUpdates()
      // autoUpdater.checkForUpdatesAndNotify()
    }
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
