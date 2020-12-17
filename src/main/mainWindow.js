import path from 'path'
import { app, shell } from 'electron'
import BrowserWinHandler from './BrowserWinHandler'

import autoUpdater from './auto-updater'

import { setMenu } from './menu'
const log = require('electron-log')
const isDev = require('electron-is-dev')

// const isDev = process.env.NODE_ENV === 'development'

const INDEX_PATH = path.join(__dirname, '..', 'renderer', 'index.html')
const DEV_SERVER_URL = process.env.DEV_SERVER_URL // eslint-disable-line prefer-destructuring

const winHandler = new BrowserWinHandler({
  height: 750,
  width: 1200,
  useContentSize: true,
  backgroundColor: '#F5F5F5',
  // show: false, // Shown when ready-to-show event fires
  webPreferences: {
    webviewTag: true, // Required
    nodeIntegration: true, // Required
    enableRemoteModule: true,
  },
  titleBarStyle: 'hiddenInset', // Hide the bar
})

winHandler.onCreated((browserWindow) => {
  if (isDev) browserWindow.loadURL(DEV_SERVER_URL)
  else browserWindow.loadFile(INDEX_PATH)

  // Do stuff...

  // Check for updates...
  // Important to not wait for page to load
  // just in case there was a fatal bug
  // with their current release
  autoUpdater(browserWindow)

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
