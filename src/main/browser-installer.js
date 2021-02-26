/**
 * This script allows Reflex to install browser binaries.
 * This is necessary to allow users to take cross-browser screenshots and other
 * functionalities.
 */

import { Installer as PlaywrightBrowserInstaller } from 'electron-playwright-browser-installer'
import log from 'electron-log'

if (!PlaywrightBrowserInstaller) log.error('Module not defined!')

// The following is essential:
// Tells PLaywright to look inside of ./node_modules/playwright-* for
// the browser binaries
process.env.PLAYWRIGHT_BROWSERS_PATH = '0'

// Run the installer
// If the applications are already installed at the given path,
// they won't be reinstalled
const inst = new PlaywrightBrowserInstaller()

export default async function run(window) {
  log.info('Running browser installer...')

  // Should add logging here
  await inst.run().catch((err) => {
    log.error(err)
  })
  console.log('Done installing browsers!')
}
