import {
  ElectronApplication,
  Page,
  _electron as electron,
} from '@playwright/test'
import { test as baseTest } from '@playwright/test'
import path from 'path'
import fs from 'fs/promises'

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
    const root = path.join(buildDir, '/mac/Reflex.app')
    const packageJson = await fs
      .readFile(path.join(root, '/Contents/Resources/app/package.json'), 'utf8')
      .then((data) => JSON.parse(data))

    const resourcesDir = path.join(buildDir, 'Contents', 'Resources')

    appPath = path.join(root, '/Contents/MacOS/Reflex')
    electronApp = await electron.launch({
      executablePath: appPath,
      args: [path.join(resourcesDir, 'app', packageJson.main)],
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
      return window.localStorage.clear()
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
