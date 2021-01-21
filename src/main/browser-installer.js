/**
 * This script allows Reflex to install browser binaries.
 * This is necessary to allow users to take cross-browser screenshots and other
 * functionalities.
 */

import { Installer as PlaywrightBrowserInstaller } from 'electron-playwright-browser-installer'
import log from 'electron-log'

if (!PlaywrightBrowserInstaller) log.error('Module not defined!')

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
