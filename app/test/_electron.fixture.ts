import { ElectronApplication, _electron as electron } from '@playwright/test'
import { test as baseTest } from '@playwright/test'
import path from 'path'

export const test = baseTest.extend<{ electronApp: ElectronApplication }>({
  electronApp: async ({}, use) => {
    // Setup code
    const appPath = path.join(
      __dirname,
      '../build/Reflex.app/Contents/MacOS/Reflex'
    )
    const electronApp = await electron.launch({ executablePath: appPath })

    electronApp.on('window', async (page) => {
      const filename = page.url()?.split('/').pop()
      console.log(`Window opened: ${filename}`)

      // capture errors
      page.on('pageerror', (error) => {
        console.error(error)
      })

      // capture console messages
      page.on('console', (msg) => {
        console.log(msg.text())
      })
    })

    // Pass the electronApp to the tests
    await use(electronApp)
  },
})

// test.afterAll(async ({ electronApp }) => {
//   await electronApp.close()
// })
