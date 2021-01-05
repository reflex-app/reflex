/**
 * This script allows Reflex to install browser binaries.
 * This is necessary to allow users to take cross-browser screenshots and other
 * functionalities.
 */

import PlaywrightBrowserInstaller from 'electron-playwright-browser-installer'
import log from 'electron-log'

if (!PlaywrightBrowserInstaller) log.error('Module not defined!')

// Run the installer
// If the applications are already installed at the given path,
// they won't be reinstalled
const inst = new PlaywrightBrowserInstaller()

export default async function run() {
  log.info('Running browser installer...')
  // Should add logging here
  await inst.run().catch((err) => {
    log.error(err)
  })
  console.log('Done installing browsers!')
}

// Tell Playwright to look within the node_modules/.local-browsers directory
// https://github.com/microsoft/playwright/blob/master/docs/api.md#environment-variables
// if (isDev) {
//   process.env.PLAYWRIGHT_BROWSERS_PATH = 0
//   log.info(`Set browser path: ${process.env.PLAYWRIGHT_BROWSERS_PATH}`)
// } else {
//   // When compiled, we are accessing Playwright via a Web Worker
//   // and the Web Worker's path is not
//   // Set the env var that Playwright will check for
//   process.env.PLAYWRIGHT_BROWSERS_PATH = path.join(
//     app.getAppPath(),
//     '/node_modules/playwright/.local-browsers'
//   )

//   log.info(`Set browser path: ${process.env.PLAYWRIGHT_BROWSERS_PATH}`)

//   // Waiting on https://github.com/electron-userland/electron-builder/issues/5500
//   // if (!__resources)
//   //   throw new Error(
//   //     `Resources path not found. Likely an issue with Electron-Nuxt.
//   //     See: https://michalzaq12.github.io/electron-nuxt/guide/#resolving-paths-in-html`
//   //   )

//   // process.env.PLAYWRIGHT_BROWSERS_PATH = path.join(
//   //   __resources, // this will be defined by electron-nuxt (https://michalzaq12.github.io/electron-nuxt/guide/#resolving-paths-in-html)
//   //   '/.local-browsers'
//   // )
// }
