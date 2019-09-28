'use strict'

import {
  app,
  shell,
  BrowserWindow
} from 'electron'
import autoUpdater from './auto-updater'

import {
  setMenu
} from './menu'

import {
  version
} from '../../package.json'
const log = require('electron-log')
const isDev = require('electron-is-dev')

// Set the version
app.getVersion = () => version

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = isDev
  ? 'http://localhost:9080'
  : `file://${__dirname}/index.html`

async function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 750,
    width: 1200,
    useContentSize: true,
    backgroundColor: '#F5F5F5',
    show: false, // Shown when ready-to-show event fires
    webPreferences: {
      webviewTag: true, // Required
      nodeIntegration: true // Required
    },
    titleBarStyle: 'hiddenInset' // Hide the bar
  })

  // Check for updates...
  // Important to not wait for page to load
  // just in case there was a fatal bug
  // with their current release
  autoUpdater(mainWindow)

  // Log the version
  log.info(`Version ${app.getVersion()}`)

  // Load the web app
  mainWindow.loadURL(winURL)

  // Setup the menu
  setMenu(mainWindow)

  // Show the app once it's ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  // Listen for outbound links and
  // open in user's default web browser
  // instead of inside Electron app
  mainWindow.webContents.on('will-navigate', (event, url) => {
    event.preventDefault()
    shell.openExternal(url)
  })

  // Listen for window to be closed
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// Webview Settings
app.on('web-contents-created', (event, contents) => {
  contents.on('will-attach-webview', (event, webPreferences, params) => {
    webPreferences.nodeIntegration = false // Disable Node.js integration inside <webview>
    // webPreferences.webSecurity = false // Disable web security

    // Strip away preload scripts if unused or verify their location is legitimate
    delete webPreferences.preload
    delete webPreferences.preloadURL
  })
})

// Workarounds to allow accessing self-signed HTTPS sites (w/ BrowserSync)
// @TODO: Can this be solved w/ BrowserSync's self-signed?
app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
  // On certificate error we disable default behaviour (stop loading the page)
  // and we then say "it is all fine - true" to the callback
  event.preventDefault()
  callback(true)
}).on('select-client-certificate', (event, webContents, url, list, callback) => {
  event.preventDefault()
  callback(list[0])
})
