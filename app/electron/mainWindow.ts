import path from 'path'
import {
  BrowserWindow,
  BrowserWindowConstructorOptions,
  app,
  ipcMain,
  shell,
} from 'electron'
import BrowserWinHandler from './BrowserWinHandler'
import windowPosition from './windowPosition'
// import browserInstaller from './browser-installer'
import { setMenu } from './menu'
import { init as initUpdates } from './updates'
import browserInstaller from './browser-installer'
import { installBrowsers } from './cross-browser/playwright-browser-manager'

import log from 'electron-log'
import isDev from 'electron-is-dev'
import enableCrossBrowserScreenshots from './cross-browser/screenshots/api'

const INDEX_PATH = path.join(__dirname, '..', 'renderer', 'index.html')
const DEV_SERVER_URL = process.env.DEV_SERVER_URL // eslint-disable-line prefer-destructuring

export default function init() {
  // Get saved window position state
  windowPosition.onAppLoad()
  const initialWindowPos = windowPosition.getState()

  const winHandler = new BrowserWinHandler({
    x: (initialWindowPos.bounds && initialWindowPos.bounds.x) || undefined,
    y: (initialWindowPos.bounds && initialWindowPos.bounds.y) || undefined,
    width: (initialWindowPos.bounds && initialWindowPos.bounds.width) || 1200,
    height: (initialWindowPos.bounds && initialWindowPos.bounds.height) || 750,
    useContentSize: true,
    backgroundColor: '#F5F5F5',
    webPreferences: {
      webviewTag: true, // Required
      nodeIntegration: true, // Required
      nodeIntegrationInWorker: true, // Enable Web Workers https://www.electronjs.org/docs/tutorial/multithreading
      contextIsolation: false, // Required Electron 12
    },
    titleBarStyle: 'hiddenInset', // Hide the bar
  })

  winHandler.onCreated(async (browserWindow: BrowserWindow) => {
    // Restore maximized state if it is set.
    // not possible via Electron options so we do it here
    if (initialWindowPos.isMaximized) {
      browserWindow.maximize()
    }

    // Watch for window change events
    ;['resize', 'move', 'close'].forEach(function (e) {
      browserWindow.on(e, () => windowPosition.saveState(browserWindow))
    })

    // Load the Nuxt app
    await winHandler.loadPage().catch((err) => log.error(err))

    // Log the version
    log.info(`Version ${app.getVersion()}`)

    // Setup the menu
    setMenu(browserWindow)

    // Show the app once it's ready
    browserWindow.once('ready-to-show', () => {
      // browserWindow.show()

      // Check for updates...
      initUpdates(browserWindow)
    })

    // Check for browser installations
    // TODO Fix errors
    // browserInstaller(winHandler)
    await installBrowsers()

    // Screenshot worker test
    enableCrossBrowserScreenshots()

    // Reload when requested by the renderer process
    ipcMain.handle('reload-window', () => {
      browserWindow.reload()
    })

    // Listen for outbound links and
    // open in user's default web browser
    // instead of inside Electron app
    browserWindow.webContents.on('will-navigate', (event, url) => {
      event.preventDefault()
      shell.openExternal(url)
    })

    // Listen for window to be closed
    browserWindow.on('closed', () => {
      browserWindow = null
    })
  })
}
