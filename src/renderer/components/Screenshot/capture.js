import {
  clipboard,
  nativeImage,
  remote
} from 'electron'

import isElectron from 'is-electron'



const {
  dialog
} = isElectron() ? remote : {}

const path = require('path')
const fs = require('fs')
const moment = require('moment')

function getWebview(id) {
  // TODO add test here, selectors are brittle
  return document.querySelector(`[artboard-id="${id}"] webview`)
}

export async function capture(id, title, screenshotPath) {
  async function saveScreenshot(screenshot) {
    if (!screenshotPath) {
      // Case: no path set yet (single screenshot save)
      // Prompt location to save screenshot
      if (isElectron()) {
        dialog.showOpenDialog({
          properties: ['openFile', 'openDirectory', 'createDirectory']
        },
        function (filePaths) {
          try {
            makeFile(filePaths[0], screenshot)
          } catch (e) {
            // Nothing was selected
          }
        }
        )
      }
    } else {
      // Case: already has a path (multi-save)
      makeFile(screenshotPath, screenshot)
    }
  }

  // Create the file
  function makeFile(filePath, screenshot) {
    const timestamp = moment().format('YYYY-MM-D_h-mm-ssa')

    if (title) {
      title = `_${title}_`
    } else {
      title = ''
    }

    fs.writeFile(
      path.join(filePath, `reflex${title}${timestamp}.png`),
      screenshot,
      err => {
        if (err) throw err
        // Alert the user that the screenshot was saved
        new Notification('Screenshot saved', {
          body: filePath
        })
      }
    )
  }

  try {
    // Capture the <webview>
    // Loop through the selected Webviews
    const webview = getWebview(id)
    webview.getWebContents().capturePage(image => {
      const PNG = image.toPNG()
      saveScreenshot(PNG)
    })
  } catch (error) {
    throw new Error(error)
  }
}

export function captureMultiple(ids) {
  // Accepts an array of ids to capture [ 0, 1 ]
  if (!ids) return false

  // 1. Capture the path to save all
  dialog.showOpenDialog({
    properties: ['openFile', 'openDirectory', 'createDirectory']
  },
  function (filePaths) {
    try {
      if (filePaths.length > 0) {
        // Capture each & save it
        const captureEach = (array) => {
          for (const item of array) {
            capture(
              item,
              `${item}`,
              filePaths[0]
            )
          }
        }

        captureEach(ids)
        return filePaths[0]
      } else {
        // None selected
      }
    } catch (err) {
      throw new Error(err)
    }
  }
  )
}

// Capture ALL the screens
export async function captureAll(vm) {
  // 1. Get the file path to save all
  dialog.showOpenDialog({
    properties: ['openFile', 'openDirectory', 'createDirectory']
  },
  async function (filePaths) {
    // 2. Capture each & save it
    for (let i = 0; i < vm.artboards.length; i++) {
      await capture(
        i,
        `${vm.artboards[i].title}_${i}`,
        filePaths[0]
      )
    }

    return filePaths[0]
  }
  )
}

// Take a screenshot
// Return the image (NativeImage)
export async function screenshot(id) {
  try {
    const webview = getWebview(id)
    return webview.getWebContents().capturePage(image => {
      return image
    })
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Save an image to the user's clipboard
 * https://electronjs.org/docs/api/clipboard#clipboardwriteimageimage-type
 * @param {*} id This is the unique id of an artboard, not the HTML DOM index
 */
export async function copyToClipboard(id) {
  try {
    const image = await screenshot(id)
    // Convert again to the proper format
    // NativeImage in PNG format
    // https://electronjs.org/docs/api/native-image
    // via https://github.com/electron/electron/issues/8151#issuecomment-265288291
    clipboard.writeImage(nativeImage.createFromBuffer(image.toPNG()))
  } catch (err) {
    throw new Error('Error writing to clipboard')
  }
}
