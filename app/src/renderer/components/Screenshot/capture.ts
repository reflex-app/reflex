import { clipboard, nativeImage, shell } from 'electron'
import { dialog, webContents } from '@electron/remote'
import * as htmlToImage from 'html-to-image'
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image'

import isElectron from 'is-electron'

const path = require('path')
const fs = require('fs')
const moment = require('moment')

// Returns a WebView
export function getWebview(id) {
  // TODO add test here, selectors are brittle
  const dom = document.querySelector(`[artboard-id="${id}"] webview`)
  return dom
  // return webContents.fromId(dom.getWebContentsId())
}

// Returns the WebContents from a given WebView
export function getWebViewContents(id) {
  const webview = getWebview(id)
  return webContents.fromId(webview.getWebContentsId())
}

export async function capture(id, title, screenshotPath) {
  async function saveScreenshot(screenshot) {
    if (!screenshotPath) {
      // Case: no path set yet (single screenshot save)
      // Prompt location to save screenshot
      if (isElectron()) {
        const fileSelection = dialog.showOpenDialog({
          properties: ['openFile', 'openDirectory', 'createDirectory'],
        })

        await fileSelection.then((result) => {
          console.log(result)

          if (result.canceled || !result.filePaths.length) return false

          try {
            makeFile(result.filePaths[0], screenshot)
          } catch (e) {
            // Nothing was selected
            console.log('No file or directory selected')
          }
        })
      }
    } else {
      // Case: already has a path (multi-save)
      makeFile(screenshotPath, screenshot)
    }
  }

  // Create the file
  function makeFile(filePath, screenshot) {
    const timestamp = moment().format('YYYY-MM-D_h-mm-ssa')
    const fullFilePath = path.join(filePath, `${title}_${timestamp}.png`)

    title ? (title = `_${title}_`) : (title = '')

    fs.writeFile(fullFilePath, screenshot, (err) => {
      if (err) throw err

      // Open in Finder
      shell.showItemInFolder(fullFilePath)
    })
  }

  try {
    // Capture the <webview>
    // Loop through the selected Webviews
    const webview = getWebViewContents(id)
    const image = await webview.capturePage()
    saveScreenshot(image.toPNG())
  } catch (error) {
    throw new Error(error)
  }
}

export async function captureMultiple(ids) {
  // Accepts an array of ids to capture [ 0, 1 ]
  if (!ids) return false

  // 1. Capture the path to save all
  const fileSelection = dialog.showOpenDialog({
    properties: ['openFile', 'openDirectory', 'createDirectory'],
  })

  await fileSelection.then((result) => {
    if (result.canceled || !result.filePaths.length) return false

    try {
      // Capture each & save it
      for (const item of ids) {
        capture(item, `${item}`, result.filePaths[0])
      }

      return result.filePaths[0]
    } catch (err) {
      throw new Error(err)
    }
  })
}

// Capture ALL the screens
export function captureAll(vm) {
  // 1. Get the file path to save all
  dialog.showOpenDialog(
    {
      properties: ['openFile', 'openDirectory', 'createDirectory'],
    },
    async function (filePaths) {
      // 2. Capture each & save it
      for (let i = 0; i < vm.artboards.length; i++) {
        await capture(i, `${vm.artboards[i].title}_${i}`, filePaths[0])
      }

      return filePaths[0]
    }
  )
}

async function useElectronCaptureAPI(id) {
  try {
    // Capture the <webview>
    // Loop through the selected Webviews
    const webview = getWebViewContents(id)
    const image = await webview.capturePage()
    return image.toDataURL()
  } catch (error) {
    throw new Error(error)
  }
}

async function useAlternativeCaptureAPI(id) {
  // Get the ID of the WebView
  const webviewContents = getWebViewContents(id)

  // The WebView element
  const webviewElement = getWebview(id)

  // Device Pixel Ratio
  const DPI = window.devicePixelRatio // TODO make this configurable rather than based on the current device's pixel density

  // WebView scroll positions
  const webviewScrollPosition = await webviewContents.executeJavaScript(
    `(() => ({ x: window.pageXOffset, y: window.pageYOffset }))()`
  )
  webviewScrollPosition.x = webviewScrollPosition.x * DPI
  webviewScrollPosition.y = webviewScrollPosition.y * DPI

  // Get the dimensions of the web page content
  const rect = await webviewContents.executeJavaScript(
    `(() => ({ width: document.body.offsetWidth, height: document.body.offsetHeight }))()`
  )
  rect.width = rect.width * DPI
  rect.height = rect.width * DPI

  // The WebView (Artboard) dimensions
  // Measured in pixels; not scaled by DPI
  const artboard = {
    width: webviewElement.scrollWidth,
    height: webviewElement.scrollHeight,
  }

  // Wait for the image to be created (base64) and return it (nativeImage)
  async function createScreenshot() {
    return new Promise((resolve, reject) => {
      try {
        // Initiate listener
        webviewElement.addEventListener('ipc-message', handleWebViewListener)

        function handleWebViewListener(event, ...args) {
          if (event.channel === 'REFLEX_SCREENSHOT-done') {
            console.log(event)
            const base64 = event?.args[0]
            webviewElement.removeEventListener(
              'ipc-message',
              handleWebViewListener
            ) // Remove listener
            resolve(nativeImage.createFromDataURL(base64)) // Return the image
          }
        }

        // Request the screenshot
        webviewContents.send('REFLEX_SCREENSHOT-start', {
          pixelRatio: DPI, // Image pixel density (i.e. )
        })
      } catch (err) {
        reject(err)
      }
    })
  }

  // Create the image
  const fullImage = await createScreenshot()

  // Return a base64 image
  if (options.fullPage) {
    // Case: Full-page screenshot
    // Request & wait for the image
    return fullImage
  } else {
    // Case: Partial screenshot
    const cropSettings = {
      x: 0,
      y: 0,
      width: artboard.width,
      height: artboard.height,
      pixelRatio: DPI,
    }

    // Case: User has scrolled
    // Adjust cropping to the scroll position
    const userDidScroll =
      webviewScrollPosition.x > 0 || webviewScrollPosition.y > 0
    if (userDidScroll) {
      cropSettings.x = webviewScrollPosition.x
      cropSettings.y = webviewScrollPosition.y
      console.info('User scroll accounted for')
    }

    // Return the cropped image based on the WebView dimensions
    return await cropImage(fullImage, cropSettings)
  }

  // TODO bug: capturePage only captures part of the WebView that is within the window's viewport...
  // https://github.com/electron/electron/issues/8587
  // https://github.com/electron/electron/issues/8314

  // TODO add an option to hide scrollbars-- this is easily done by `webview.capturePage(rect)`

  // Return an image
  // return webview.capturePage()
}

// Take a screenshot
// Return the image (NativeImage) as a Promise
interface ScreenshotOptions {
  fullPage: boolean
  isArtboardInViewport: boolean
}
export async function screenshot(id, options: ScreenshotOptions) {
  // Check if the WebView is in the viewport
  if (options.isArtboardInViewport) {
    useElectronCaptureAPI(id)
  } else {
    // TODO improve UI for this alert; does not need to be so prominent
    alert(
      'The artboard is not completely within view. Please move it into view and try again for best results.'
    )
    useAlternativeCaptureAPI(id)
  }

  //   // Get the ID of the WebView
  //   const webviewContents = getWebViewContents(id)

  //   // The WebView element
  //   const webviewElement = getWebview(id)

  //   // Device Pixel Ratio
  //   const DPI = window.devicePixelRatio // TODO make this configurable rather than based on the current device's pixel density

  //   // WebView scroll positions
  //   const webviewScrollPosition = await webviewContents.executeJavaScript(
  //     `(() => ({ x: window.pageXOffset, y: window.pageYOffset }))()`
  //   )
  //   webviewScrollPosition.x = webviewScrollPosition.x * DPI
  //   webviewScrollPosition.y = webviewScrollPosition.y * DPI

  //   // Get the dimensions of the web page content
  //   const rect = await webviewContents.executeJavaScript(
  //     `(() => ({ width: document.body.offsetWidth, height: document.body.offsetHeight }))()`
  //   )
  //   rect.width = rect.width * DPI
  //   rect.height = rect.width * DPI

  //   // The WebView (Artboard) dimensions
  //   // Measured in pixels; not scaled by DPI
  //   const artboard = {
  //     width: webviewElement.scrollWidth,
  //     height: webviewElement.scrollHeight,
  //   }

  //   // Wait for the image to be created (base64) and return it (nativeImage)
  //   async function createScreenshot() {
  //     return new Promise((resolve, reject) => {
  //       try {
  //         // Initiate listener
  //         webviewElement.addEventListener('ipc-message', handleWebViewListener)

  //         function handleWebViewListener(event, ...args) {
  //           if (event.channel === 'REFLEX_SCREENSHOT-done') {
  //             console.log(event)
  //             const base64 = event?.args[0]
  //             webviewElement.removeEventListener(
  //               'ipc-message',
  //               handleWebViewListener
  //             ) // Remove listener
  //             resolve(nativeImage.createFromDataURL(base64)) // Return the image
  //           }
  //         }

  //         // Request the screenshot
  //         webviewContents.send('REFLEX_SCREENSHOT-start', {
  //           pixelRatio: DPI, // Image pixel density (i.e. )
  //         })
  //       } catch (err) {
  //         reject(err)
  //       }
  //     })
  //   }

  //   // Create the image
  //   const fullImage = await createScreenshot()

  //   // Return a base64 image
  //   if (options.fullPage) {
  //     // Case: Full-page screenshot
  //     // Request & wait for the image
  //     return fullImage
  //   } else {
  //     // Case: Partial screenshot
  //     const cropSettings = {
  //       x: 0,
  //       y: 0,
  //       width: artboard.width,
  //       height: artboard.height,
  //       pixelRatio: DPI,
  //     }

  //     // Case: User has scrolled
  //     // Adjust cropping to the scroll position
  //     const userDidScroll =
  //       webviewScrollPosition.x > 0 || webviewScrollPosition.y > 0
  //     if (userDidScroll) {
  //       cropSettings.x = webviewScrollPosition.x
  //       cropSettings.y = webviewScrollPosition.y
  //       console.info('User scroll accounted for')
  //     }

  //     // Return the cropped image based on the WebView dimensions
  //     return await cropImage(fullImage, cropSettings)
  //   }

  //   // TODO bug: capturePage only captures part of the WebView that is within the window's viewport...
  //   // https://github.com/electron/electron/issues/8587
  //   // https://github.com/electron/electron/issues/8314

  //   // TODO add an option to hide scrollbars-- this is easily done by `webview.capturePage(rect)`

  //   // Return an image
  //   // return webview.capturePage()
  // } catch (error) {
  //   throw new Error(error)
  // }
}

/**
 *
 * Creates a cropped version of an image
 */
async function cropImage(
  nativeImageObject,
  { x, y, width, height, pixelRatio }
) {
  // Crop the image based on the WebView dimensions
  // Height and width are scaled based on the pixel ratio
  return await nativeImageObject.crop({
    x: x,
    y: y,
    width: width * pixelRatio,
    height: height * pixelRatio,
  })
}

/**
 * Save an image to the user's clipboard
 * https://electronjs.org/docs/api/clipboard#clipboardwriteimageimage-type
 * @param {*} id This is the unique id of an artboard, not the HTML DOM index
 */

interface ClipboardOptions {
  fullPage: boolean
  isArtboardInViewport: boolean
}

export async function copyToClipboard(id: any, options: ClipboardOptions) {
  try {
    const image = await screenshot(id, {
      fullPage: options.fullPage || false,
      isArtboardInViewport: options.isArtboardInViewport || false,
    })
    // Convert again to the proper format
    // NativeImage in PNG format
    // https://electronjs.org/docs/api/native-image
    // via https://github.com/electron/electron/issues/8151#issuecomment-265288291

    // const img = nativeImage.createFromBuffer(image.toPNG())
    const img = nativeImage.createFromBuffer(image.toPNG())
    // const img = image

    // Write to clipboard
    clipboard.writeImage(img)

    // Alert the user that the image was copied
    console.log('Copied to clipboard!')

    // Done
    return true
  } catch (err) {
    throw new Error(err)
  }
}
