/**
 * This script allows Reflex to install browser binaries.
 * This is necessary to allow users to take cross-browser screenshots and other
 * functionalities.
 */

import path from 'path'
import { Installer as PlaywrightBrowserInstaller } from '@reflex/browser-installer' // TODO: Add types
import log from 'electron-log'
import { app } from 'electron'

if (!PlaywrightBrowserInstaller) log.error('Module not defined!')

// The following is essential:
// Tells PLaywright to look inside of ./node_modules/playwright-* for
// the browser binaries
process.env.PLAYWRIGHT_BROWSERS_PATH = '0'

// Old approach browserType.downloadBrowserIfNeeded() https://github.com/microsoft/playwright/pull/834
// New approach https://github.com/microsoft/playwright/pull/1419
// https://github.com/microsoft/playwright/blob/10ce7af411edf5c31a4e81fd0f96bfde47de8c24/packages/playwright-core/src/server/registry/index.ts#L932

// Run the installer
// If the applications are already installed at the given path,
// they won't be reinstalled
const inst = new PlaywrightBrowserInstaller({
  browsers: ['firefox', 'webkit'],
  installPath: path.resolve(app.getPath('userData'), './browsers'), // Install relative to the app
})

export default async function run(window) {
  log.info('Running browser installer...')

  // Should add logging here
  await inst
    .run()
    .then(() => {
      console.log('Done installing browsers!')
    })
    .catch((err: unknown) => {
      log.error(err)
    })
}
