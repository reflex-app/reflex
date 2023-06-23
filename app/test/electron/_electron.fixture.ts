import {
  ElectronApplication,
  Page,
  _electron as electron,
} from '@playwright/test'
import { test as baseTest } from '@playwright/test'
import path from 'path'
import fs from 'fs/promises'
import { BrowserWindow } from 'electron'
import appConfig from '@/builder.config'
import os from 'os'

// TODO make this dynamic
const isDevApp = false

interface ModifiedElectronApplication extends ElectronApplication {
  executablePath: string
  resourcesPath: string
  appFilesPath: string
  appDirPath: string
}

let electronApp: ModifiedElectronApplication | null // The Electron app

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
    electronApp = await electron.launch({ args: [appPath] }) as ModifiedElectronApplication
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
    }) as ModifiedElectronApplication

    if (appPath) {
      if (!electronApp) throw new Error('Failed to launch Electron app')

      // Path to the Electron app
      // e.g. /Applications/Reflex.app
      electronApp.executablePath = await electronApp.evaluate(async () => {
        return process.execPath
      })

      // Set the path to the Electron app's directory
      const setAppDirPath = async (executablePath: string) => {
        let packagePath: string | null = null;

        if (os.platform() === 'darwin') { // MacOS
          packagePath = path.resolve(executablePath, '../../..');
        } else if (os.platform() === 'win32') { // Windows
          packagePath = path.dirname(executablePath);
        }

        if (!packagePath) throw new Error('Failed to get package path')

        return packagePath
      }
      electronApp.appDirPath = await setAppDirPath(electronApp.executablePath)

      // Path to the Electron app's resources directory
      // e.g. /Applications/Reflex.app/Contents/Resources
      electronApp.resourcesPath = await electronApp.evaluate(async () => {
        return process.resourcesPath
      })

      // Path to the Electron app's files directory
      electronApp.appFilesPath = path.join(electronApp.resourcesPath, `${appConfig.asar ? 'app.asar.unpacked' : 'app'}`)
    }
  }

  return electronApp
}

export const test = baseTest.extend<{
  electronApp: ModifiedElectronApplication
}>({
  electronApp: async ({ page }, use) => {
    const electronApp = await runApp()

    // Wait for the app to be ready
    const window = await electronApp.firstWindow()
    await window.waitForLoadState('load')

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
