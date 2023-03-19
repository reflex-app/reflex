import path from 'path'
import { app, shell } from 'electron'
import BrowserWinHandler from './BrowserWinHandler'
import windowPosition from './windowPosition'
import autoUpdater from './updates/auto-updater'
// import browserInstaller from './browser-installer'
import { setMenu } from './menu'
import { init as initUpdates } from './updates'

const log = require('electron-log')
const isDev = require('electron-is-dev')
// const isDev = process.env.NODE_ENV === 'development'
const INDEX_PATH = path.join(__dirname, '..', 'renderer', 'index.html')
const DEV_SERVER_URL = process.env.DEV_SERVER_URL // eslint-disable-line prefer-destructuring

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

winHandler.onCreated(async (browserWindow) => {
  // Restore maximized state if it is set.
  // not possible via Electron options so we do it here
  if (initialWindowPos.isMaximized) {
    browserWindow.maximize()
  }

  // Watch for window change events
  ;['resize', 'move', 'close'].forEach(function (e) {
    browserWindow.on(e, () => windowPosition.saveState(browserWindow))
  })

  // Load the app
  try {
    await winHandler.loadPage('/')
  } catch (err) {
    log.error(err)
  }
  // if (isDev) browserWindow.loadURL(DEV_SERVER_URL)
  // else browserWindow.loadFile(INDEX_PATH)

  // Do stuff...

  // Check for updates...
  // Important to not wait for page to load
  // just in case there was a fatal bug
  // with their current release
  initUpdates(browserWindow)
  // autoUpdater(browserWindow)

  // Check for browser installations
  // TODO Fix errors
  // browserInstaller(winHandler)

  // Log the version
  log.info(`Version ${app.getVersion()}`)

  // Setup the menu
  setMenu(browserWindow)

  // Show the app once it's ready
  // browserWindow.once('ready-to-show', () => {
  //   browserWindow.show()
  // })

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

export default winHandler
