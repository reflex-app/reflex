const log = require('electron-log')
const {
  autoUpdater
} = require('electron-updater')

autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'

export default function init(window) {
  const win = window

  // Check for updates
  sendStatusToWindow('Checking for updates...')
  autoUpdater.checkForUpdatesAndNotify()

  function sendStatusToWindow(text) {
    win.webContents.send('message', text)
  }

  autoUpdater.on('checking-for-update', () => {
    log.info('checking for update')
    sendStatusToWindow('Checking for update...')
  })
  autoUpdater.on('update-available', (info) => {
    log.info('update available')
    sendStatusToWindow('Update available.')
  })
  autoUpdater.on('update-not-available', (info) => {
    log.info('update not available')
    sendStatusToWindow('Update not available.')
  })
  autoUpdater.on('error', (err) => {
    log.info('error in auto-updater')
    sendStatusToWindow('Error in auto-updater. ' + err)
  })
  autoUpdater.on('download-progress', (progressObj) => {
    let logMessage = 'Download speed: ' + progressObj.bytesPerSecond
    logMessage = logMessage + ' - Downloaded ' + progressObj.percent + '%'
    logMessage = logMessage + ' (' + progressObj.transferred + '/' + progressObj.total + ')'
    sendStatusToWindow(logMessage)
  })
  autoUpdater.on('update-downloaded', (info) => {
    log.info('update downloaded')
    sendStatusToWindow('Update downloaded')
  })
}
