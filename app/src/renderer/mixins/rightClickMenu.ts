/**
 * Creates a generic right-click menu
 */
import * as remote from '@electron/remote'
import { Menu, MenuItem } from '@electron/remote' // TODO Migrate to @electron/remote and move this logic to main process
import isElectron from 'is-electron'
import Trigger from '~/components/CrossBrowser/Screenshots/Trigger.vue'
import { useArtboardsStore } from '~/store/artboards'

/**
 * @param {Object} store The Vue component's context
 * @param {Object} artboard The specific artboard
 * @param {DOMElement} webview The artboard's Webview DOM element
 */
export default function (store, artboard) {
  const artboardFrame = getArtboard(artboard.id).querySelector('webview')

  // Require DOMElement and Electron context
  if (!artboardFrame || !isElectron()) return false

  const menu = new Menu()
  menu.append(
    new MenuItem({
      label: 'Duplicate',
      click() {
        const store = useArtboardsStore()
        store.duplicateArtboard(artboard)
      },
    })
  )
  menu.append(
    new MenuItem({
      label: 'Rotate',
      click() {
        const store = useArtboardsStore()
        store.resizeArtboard({
          id: artboard.id,
          width: artboard.height,
          height: artboard.width,
        })
      },
    })
  )
  menu.append(
    new MenuItem({
      label: artboard.isVisible ? 'Hide' : 'Show',
      click() {
        const store = useArtboardsStore()
        store.changeArtboardVisibility(artboard)
      },
    })
  )
  menu.append(
    new MenuItem({
      label: 'Open DevTools',
      click() {
        artboardFrame.openDevTools()
      },
    })
  )
  menu.append(
    new MenuItem({
      label: 'Preview Cross-browser',
      click() {
        try {
          // Emit an event to the correct artboard
          const instance = getArtboard(artboard.id).__vue__

          // Find the child component in which to trigger a function
          const childCrossBrowserComponent = instance.$children.find((obj) =>
            obj.$vnode.tag.includes('CrossBrowserScreenshots')
          )

          // Trigger the screenshot
          childCrossBrowserComponent.getScreenshots()
        } catch (err) {
          console.log(`Cross-browser error: ${err}`)
        }
      },
    })
  )
  menu.append(
    new MenuItem({
      label: 'Delete',
      click() {
        const store = useArtboardsStore()
        store.removeArtboard(artboard.id)
      },
    })
  )
  menu.popup(remote.getCurrentWindow())
}

function getArtboard(id) {
  // TODO add test here, selectors are brittle
  // This could probably be a Store action
  return document.querySelector(`[artboard-id="${id}"]`)
}
