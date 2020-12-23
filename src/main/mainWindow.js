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
    nodeIntegrationInWorker: true, // Enable Web Workers https://www.electronjs.org/docs/tutorial/multithreading
  },
  titleBarStyle: 'hiddenInset', // Hide the bar
})

winHandler.onCreated((browserWindow) => {
  // Tell Playwright to look within the node_modules/.local-browsers directory
  // https://github.com/microsoft/playwright/blob/master/docs/api.md#environment-variables
  if (isDev) {
    process.env.PLAYWRIGHT_BROWSERS_PATH = 0
  } else {
    // When compiled, we are accessing Playwright via a Web Worker
    // and the Web Worker's path is not
    // Set the env var that Playwright will check for
    process.env.PLAYWRIGHT_BROWSERS_PATH = path.join(
      app.getAppPath(),
      '/node_modules/playwright/.local-browsers'
    )

    // Waiting on https://github.com/electron-userland/electron-builder/issues/5500
    // if (!__resources)
    //   throw new Error(
    //     `Resources path not found. Likely an issue with Electron-Nuxt.
    //     See: https://michalzaq12.github.io/electron-nuxt/guide/#resolving-paths-in-html`
    //   )

    // process.env.PLAYWRIGHT_BROWSERS_PATH = path.join(
    //   __resources, // this will be defined by electron-nuxt (https://michalzaq12.github.io/electron-nuxt/guide/#resolving-paths-in-html)
    //   '/.local-browsers'
    // )
  }

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
