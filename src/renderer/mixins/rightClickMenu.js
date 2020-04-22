/**
 * Creates a generic right-click menu
 */
import path from 'path'
import { remote } from 'electron'
import isElectron from 'is-electron'
const { Menu, MenuItem, BrowserWindow } = remote

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
        store.dispatch('artboards/duplicateArtboard', artboard)
      },
    })
  )
  menu.append(
    new MenuItem({
      label: 'Rotate',
      click() {
        store.commit('artboards/resizeArtboard', {
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
        store.commit('artboards/changeArtboardVisibility', artboard)
      },
    })
  )
  menu.append(
    new MenuItem({
      label: 'Fullscreen',
      click() {
        store.dispatch('gui/setFullscreen', true) // Always set to true
        // Current URL
        // const currURL = BrowserWindow.webContents.getURL()
        // console.log(currURL)

        // console.log(path.join(__dirname, './reflex-sync/index.js'))

        const filePath = path.resolve(__dirname, './reflex-sync/index.js')
        const pathToInject = `file://${filePath}`
        console.log(filePath, pathToInject)

        try {
          require(pathToInject)
        } catch (err) {
          throw new Error(err)
        }

        let win = new BrowserWindow({
          width: 800,
          height: 600,
          webPreferences: {
            preload: pathToInject,
          },
        })
        win.on('closed', () => {
          win = null
        })

        // Load a remote URL
        win.loadURL(store.state.history.currentPage.url)

        // window.open('http://nickwittwer.com')

        // window.open('')
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
      label: 'Delete',
      click() {
        store.dispatch('artboards/deleteArtboard', artboard)
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
