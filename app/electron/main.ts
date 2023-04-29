import isDev from 'electron-is-dev'
/* globals INCLUDE_RESOURCES_PATH */
import { app } from 'electron'
// import { version } from '../../package.json'
import fs from 'fs/promises'
import path from 'path'
import { init as initIpcHandlers } from './ipcHandlers'
import mainWindowInit from './mainWindow'
import { getPackageJson } from './util'
;(async () => {
  const version = await getPackageJson().then((data) => data.version)

  // Set the version
  app.getVersion = () => version

  // Quit when all windows are closed.
  app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit()
  })

  /**
   * Webview Settings
   */
  app.on('web-contents-created', (event, contents) => {
    contents.on('will-attach-webview', (event, webPreferences, params) => {
      // TODO: Add tests to confirm these paths are correct
      webPreferences.preload = isDev
        ? path.join(
            __dirname,
            '../../',
            'dist-electron/extraResources/inject.js'
          )
        : path.join(
            process.resourcesPath,
            '/app/dist-electron/extraResources/inject.js'
          )

      // webPreferences.nodeIntegration = false // Disable Node.js integration inside <webview>
      // webPreferences.webSecurity = false // Disable web security
      // Strip away preload scripts if unused or verify their location is legitimate
      // delete webPreferences.preload
      // delete webPreferences.preloadURL
    })
  })

  /**
   * Workarounds for accessing HTTP/HTTPS sites with Browsersync & Chromium
   */
  app.commandLine.appendSwitch('ignore-certificate-errors', 'true')
  app.commandLine.appendSwitch('allow-insecure-localhost', 'true')

  // app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
  //   // On certificate error we disable default behaviour (stop loading the page)
  //   // and we then say "it is all fine - true" to the callback
  //   event.preventDefault()
  //   callback(true)
  // }).on('select-client-certificate', (event, webContents, url, list, callback) => {
  //   event.preventDefault()
  //   callback(list[0])
  // })

  // Add IPC listeners
  initIpcHandlers()

  // Load here all startup windows
  mainWindowInit()
})()