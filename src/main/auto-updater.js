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
    let log_message = 'Download speed: ' + progressObj.bytesPerSecond
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%'
    log_message = log_message + ' (' + progressObj.transferred + '/' + progressObj.total + ')'
    sendStatusToWindow(log_message)
  })
  autoUpdater.on('update-downloaded', (info) => {
    log.info('update downloaded')
    sendStatusToWindow('Update downloaded')
  })

  // let win

  // function sendStatusToWindow(text) {
  //   log.info(text)
  //   win.webContents.send('message', text)
  // }

  // function createDefaultWindow() {
  //   win = new BrowserWindow()
  //   win.webContents.openDevTools()
  //   win.on('closed', () => {
  //     win = null
  //   })
  //   win.loadURL(`file://${__dirname}/version.html#v${app.getVersion()}`)
  //   return win
  // }
  // autoUpdater.on('checking-for-update', () => {
  //   sendStatusToWindow('Checking for update...')
  // })
  // autoUpdater.on('update-available', (info) => {
  //   sendStatusToWindow('Update available.')
  // })
  // autoUpdater.on('update-not-available', (info) => {
  //   sendStatusToWindow('Update not available.')
  // })
  // autoUpdater.on('error', (err) => {
  //   sendStatusToWindow('Error in auto-updater. ' + err)
  // })
  // autoUpdater.on('download-progress', (progressObj) => {
  //   let log_message = 'Download speed: ' + progressObj.bytesPerSecond
  //   log_message = log_message + ' - Downloaded ' + progressObj.percent + '%'
  //   log_message = log_message + ' (' + progressObj.transferred + '/' + progressObj.total + ')'
  //   sendStatusToWindow(log_message)
  // })
  // autoUpdater.on('update-downloaded', (info) => {
  //   sendStatusToWindow('Update downloaded')
  // })

  //
  // CHOOSE one of the following options for Auto updates
  //

  // -------------------------------------------------------------------
  // Auto updates - Option 1 - Simplest version
  //
  // This will immediately download an update, then install when the
  // app quits.
  // -------------------------------------------------------------------
  // app.on('ready', function () {
  // console.log('checking for updates')
  // autoUpdater.checkForUpdatesAndNotify()
  // })

  // -------------------------------------------------------------------
  // Auto updates - Option 2 - More control
  //
  // For details about these events, see the Wiki:
  // https://github.com/electron-userland/electron-builder/wiki/Auto-Update#events
  //
  // The app doesn't need to listen to any events except `update-downloaded`
  //
  // Uncomment any of the below events to listen for them.  Also,
  // look in the previous section to see them being used.
  // -------------------------------------------------------------------
  // app.on('ready', function()  {
  //   autoUpdater.checkForUpdates();
  // });
  // autoUpdater.on('checking-for-update', () => {
  // })
  // autoUpdater.on('update-available', (info) => {
  // })
  // autoUpdater.on('update-not-available', (info) => {
  // })
  // autoUpdater.on('error', (err) => {
  // })
  // autoUpdater.on('download-progress', (progressObj) => {
  // })
  // autoUpdater.on('update-downloaded', (info) => {
  //   autoUpdater.quitAndInstall();
  // })
}
