// import { dialog, webContents, getCurrentWindow } from '@electron/remote'
import { defaultErrorHandler } from '@/utils/error'
import isElectron from 'is-electron'
import path from 'path-browserify'
import fs from 'fs'
import moment from 'moment'

// TODO: Re-connect to Electron's APIs
// import { clipboard, nativeImage, shell } from 'electron'
const clipboard = {}
const nativeImage = {}
const shell = {}

// TODO: Re-connect to Electron's APIs
const dialog = {}
const webContents = {}
const getCurrentWindow = {}

// Returns a WebView
export function getWebview(id) {
  // TODO add test here, selectors are brittle
  const dom = document.querySelector(`[artboard-id="${id}"] webview`)
  if (!dom) {
    throw new Error(`Could not find WebView with ID: ${id}`)
  }
  return dom
}

// Returns the WebContents from a given WebView
export function getWebViewContents(id) {
  // TODO this should not require a DOM element
  const webview: any = getWebview(id)
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
    const image = await useElectronCaptureAPI(id)
    if (!image) throw new Error('Could not capture screenshot')
    await saveScreenshot(image.toPNG())

    // TODO bug: capturePage only captures part of the WebView that is within the window's viewport...
    // https://github.com/electron/electron/issues/8587
    // https://github.com/electron/electron/issues/8314

    // TODO add an option to hide scrollbars-- this is easily done by `webview.capturePage(rect)`
  } catch (err) {
    defaultErrorHandler(err)
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
      defaultErrorHandler(err)
    }
  })
}

// Capture ALL the screens
export function captureAll(vm) {
  const mainWindow = getCurrentWindow()

  dialog
    // 1. Get the file path to save all to
    .showOpenDialog(mainWindow, {
      properties: ['openFile', 'openDirectory', 'createDirectory'],
    })
    // 2. Capture each artboard & save it
    .then(async (result) => {
      if (result.canceled) return
      if (result.filePaths.length) {
        const filePath = result.filePaths[0]

        for (let i = 0; i < vm.artboards.length; i++) {
          await capture(i, `${vm.artboards[i].title}_${i}`, filePath)
        }

        return filePath
      }
    })
    .catch((err) => defaultErrorHandler(err))
}

/**
 *
 * Use Electron's API to capture a WebView screenshot
 * @param id
 * @returns NativeImage
 */
async function useElectronCaptureAPI(id: string) {
  try {
    // Capture the <webview>
    // Loop through the selected Webviews
    console.log('Taking screenshot with Electron API')
    const webview = getWebViewContents(id)
    const image = await webview.capturePage()
    return image
  } catch (err) {
    defaultErrorHandler(err)
  }
}

/**
 * Uses alternative (html-to-image) to capture a WebView screenshot
 * @param id
 * @param options
 * @returns NativeImage
 */
async function useAlternativeCaptureAPI(
  id: string,
  options: { fullPage?: boolean } = { fullPage: false }
) {
  console.log('Taking screenshot with Alternative Capture API')

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
}

// Take a screenshot
// Return the image (NativeImage) as a Promise
interface ScreenshotOptions {
  fullPage: boolean
  isArtboardInViewport: boolean
}

/**
 *
 * @param id
 * @param options
 * @returns NativeImage
 */
export async function screenshot(id, options: ScreenshotOptions) {
  const isInViewport = options.isArtboardInViewport
  const shouldCaptureFullPage = options.fullPage || false

  // 1. Check if the WebView is in the viewport
  // 2. Check if user wants fullscreen or partial screenshot

  const cases = {
    ['in-viewport-fullscreen']: isInViewport && shouldCaptureFullPage,
    ['in-viewport-partial']: isInViewport && !shouldCaptureFullPage,
    ['out-viewport-fullscreen']: !isInViewport && shouldCaptureFullPage,
    ['out-viewport-partial']: !isInViewport && !shouldCaptureFullPage,
  }

  // Find the one case
  const useCase = Object.keys(cases).find((k) => cases[k] === true)
  if (!useCase) throw new Error('Unexpected screenshot case found')

  if (['in-viewport-partial', 'in-viewport-fullscreen'].includes(useCase)) {
    return await useElectronCaptureAPI(id)
  } else if (
    ['out-viewport-partial', 'out-viewport-fullscreen'].includes(useCase)
  ) {
    alert(
      'One or more of the selected artboards to screenshot are not within view. An alternative screenshot method will be used. \n\n For best results, move the artboard(s) to screenshot completely into view and try again.'
    ) // TODO improve UI for this alert; does not need to be so prominent
    return await useAlternativeCaptureAPI(id)
  }
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
  isArtboardInViewport: boolean
  fullPage?: boolean
}

export async function copyToClipboard(id: any, options: ClipboardOptions) {
  try {
    const image = await screenshot(id, {
      isArtboardInViewport: options.isArtboardInViewport,
      fullPage: options.fullPage || false,
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
    defaultErrorHandler(err)
  }
}
