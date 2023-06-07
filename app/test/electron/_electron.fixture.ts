import {
  ElectronApplication,
  Page,
  _electron as electron,
} from '@playwright/test'
import { test as baseTest } from '@playwright/test'
import path from 'path'
import fs from 'fs/promises'
import { BrowserWindow } from 'electron'
import { app as appConfig } from '@/config/index'
import os from 'os'

// TODO make this dynamic
const isDevApp = false

let electronApp: ElectronApplication | null // The Electron app

const runApp = async () => {
  // Setup code
  let appPath

  if (electronApp) {
    // If electronApp is already defined, return it
    return electronApp
  }

  const buildDir = path.join(__dirname, '../../build')
  const electronBuildDir = path.join(__dirname, '../../dist-electron')

  if (isDevApp) {
    appPath = path.join(electronBuildDir, '/electron/main.js')
    electronApp = await electron.launch({ args: [appPath] })
  } else {    
    let root;

    if (os.platform() === 'win32') {
      root = path.join(buildDir, '/win-unpacked');
      appPath = path.join(root, '/Reflex.exe');
    } else if (os.platform() === 'darwin') {
      if (os.arch() === 'arm64') {
        // for M1+ chip
        root = path.join(buildDir, '/mac-arm64/Reflex.app');
      } else {
        // for Intel-based macs
        root = path.join(buildDir, '/mac/Reflex.app');
      }
      appPath = path.join(root, '/Contents/MacOS/Reflex');
    }

    electronApp = await electron.launch({
      executablePath: appPath,
    })
  }

  return electronApp
}

export const test = baseTest.extend<{
  electronApp: ElectronApplication
}>({
  electronApp: async ({ page }, use) => {
    const electronApp = await runApp()

    // Wait for the app to be ready
    const window = await electronApp.firstWindow()
    await window.waitForLoadState('networkidle')

    // Clear any localStorage
    await window.evaluate(() => {
      interface CustomWindow extends Page {
        localStorage: Storage
      }

      const win = window as CustomWindow

      return win.localStorage.clear()
    })

    // // capture errors
    // window.on('pageerror', (error) => {
    //   console.error(error)
    // })

    // // capture console messages
    // window.on('console', (msg) => {
    //   console.log(msg.text())
    // })

    // Pass the electronApp to the tests
    await use(electronApp)
  },
})

test.afterAll(async () => {
  if (electronApp) {
    // If electronApp is defined, close it
    await electronApp.close()
    electronApp = null // Set to null for garbage collection
  }
})

const getLocalStorage = async ({ appWindow }) => {
  return await appWindow.evaluate(() => {
    return window.localStorage
  })
}
