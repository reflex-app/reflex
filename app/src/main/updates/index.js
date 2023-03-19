import path from 'path'
import { init as initAutoUpdater } from './auto-updater'
import { init as initCheckForUpdate } from './check-for-update'
import isDev from 'electron-is-dev'
import { autoUpdater } from 'electron-updater'

export function init(window) {
  if (isDev) {
    // Useful for some dev/debugging tasks, but download can
    // not be validated becuase dev app is not signed
    // To test it out, change package.json version to a previous version
    autoUpdater.updateConfigPath = path.join(
      __dirname,
      '../../../build/dev-app-update.yml'
    )

    // Force the updater to work in “dev” mode, looking for “dev-app-update.yml” instead of “app-update.yml"
    // Docs: https://www.electron.build/api/electron-builder.html#AppUpdater-forceDevUpdateConfig
    autoUpdater.forceDevUpdateConfig = true
  }

  // Initialize updaters
  initAutoUpdater(window) // Checks immediately

  // The menu item is only enabled when user clicks it
  // initCheckForUpdate() // Waits until menu item is used
}
