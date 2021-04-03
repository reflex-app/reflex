/**
 * This script allows Reflex to install browser binaries.
 * This is necessary to allow users to take cross-browser screenshots and other
 * functionalities.
 */

import path from 'path'
import { Installer as PlaywrightBrowserInstaller } from 'reflex-browser-installer'
import log from 'electron-log'
import { app } from 'electron'

if (!PlaywrightBrowserInstaller) log.error('Module not defined!')

// Run the installer
// If the applications are already installed at the given path,
// they won't be reinstalled
const inst = new PlaywrightBrowserInstaller({
  browsers: ['firefox', 'webkit'],
  installPath: path.resolve(app.getPath('userData'), './browsers') // Install relative to the app
})

export default async function run (window) {
  log.info('Running browser installer...')

  // Should add logging here
  await inst.run().catch(err => {
    log.error(err)
  })
  console.log('Done installing browsers!')
}
