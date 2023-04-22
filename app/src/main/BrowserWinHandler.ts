import { EventEmitter } from 'events'
import { BrowserWindow, app } from 'electron'
const DEV_SERVER_URL = process.env.DEV_SERVER_URL
const isProduction = process.env.NODE_ENV === 'production'
// const isDev = process.env.NODE_ENV === 'development'
import isDev from 'electron-is-dev'
import {
  initialize as initializeRemote,
  enable as enableRemote,
} from '@electron/remote/main'
import path from 'path'

export default class BrowserWinHandler {
  /**
   * @param [options] {object} - browser window options
   * @param [allowRecreate] {boolean}
   */

  _eventEmitter: EventEmitter
  allowRecreate: boolean
  options: {
    webPreferences?: {}
  }
  browserWindow: BrowserWindow | null

  constructor(options: object, allowRecreate: boolean = true) {
    this._eventEmitter = new EventEmitter()
    this.allowRecreate = allowRecreate
    this.options = options
    this.browserWindow = null
    this._createInstance()
  }

  _createInstance() {
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    if (app.isReady()) this._create()
    else {
      app.once('ready', () => {
        this._create()
      })
    }

    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (!this.allowRecreate) return
    app.on('activate', () => this._recreate())
  }

  _create() {
    this.browserWindow = new BrowserWindow({
      ...this.options,
      show: false, // hide until loaded
      webPreferences: {
        ...this.options.webPreferences,
        webSecurity: isProduction, // disable on dev to allow loading local resources
        nodeIntegration: true, // allow loading modules via the require () function
        contextIsolation: false, // https://github.com/electron/electron/issues/18037#issuecomment-806320028
      },
    })

    // Enable remote module
    // as of @electron/remote 2.x
    // https://github.com/electron/remote/blob/main/docs/migration-2.md
    // Setup workaround for Remote module
    // https://github.com/electron/remote#migrating-from-remote
    // TODO Migrate away from Remote module
    initializeRemote()
    enableRemote(this.browserWindow.webContents)

    this.browserWindow.on('closed', () => {
      // Dereference the window object
      this.browserWindow = null
    })
    this._eventEmitter.emit('created')
  }

  _recreate() {
    if (this.browserWindow === null) this._create()
  }

  onCreated(callback) {
    if (this.browserWindow !== null) return callback(this.browserWindow)
    this._eventEmitter.once('created', () => {
      callback(this.browserWindow)
    })
  }

  async loadPage(pagePath) {
    if (!this.browserWindow)
      return Promise.reject(
        new Error("The page could not be loaded before win 'created' event")
      )

    const serverUrl = isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../nuxt/index.html')}`
    const fullPath = serverUrl + '#' + pagePath
    await this.browserWindow.loadURL(fullPath)

    // After loading the web app, show the desktop app
    this.browserWindow.show()
  }

  created(): Promise<BrowserWindow> {
    return new Promise((resolve) => {
      this.onCreated(() => resolve(this.browserWindow))
    })
  }
}
