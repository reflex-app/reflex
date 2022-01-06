/**
 * NOTE: This all happens in the Webview context
 * Communicate with renderer process (WebPage.vue) via ipcRenderer.sendToHost()
 * When this file is loaded it no longer has access to the compiled src/renderer/* files!
 */
const { contextBridge, ipcRenderer } = require('electron')
const remote = require('@electron/remote')
const setDOMEffect = require('./lib/effects')
const eventTypes = require('./lib/eventTypes')
const helpers = require('./lib/helpers')

console.log(ipcRenderer, remote)

/// ////////////////////////////
/// ////////////////////////////
/// ////////////////////////////

/**
 * Collect and send back information from the document context
 * Only done during the initial bridging
 */
document.addEventListener('DOMContentLoaded', initiateBridge)

function initiateBridge() {
  const data = {
    title: document.title,
    favicon:
      'https://www.google.com/s2/favicons?domain=' + window.location.href,
  }

  // Listen for initial connection to the frame
  ipcRenderer.once('bridgeToFrame', (event, args) => {
    // We get the ID of the artboard we're connected to
    console.log('Passed from parent:', args)
    const { id, syncFns } = args
    state.id = id

    // Respond to the parent component
    ipcRenderer.sendToHost('initiateBridge', data)
    document.removeEventListener('DOMContentLoaded', initiateBridge)

    // Run our functions
    startSync(syncFns)
  })
}

// Enable html-to-image
// https://stackoverflow.com/a/67803203
const htmlToImage = require('html-to-image')
console.log(htmlToImage)

if (window) {
  window.htmlToImage = htmlToImage
}

ipcRenderer.on('REFLEX_SCREENSHOT-start', (event, args) => {
  htmlToImage
    .toPng(document.body, {
      pixelRatio: args.pixelRatio,
    })
    .then(function (dataUrl) {
      ipcRenderer.sendToHost('REFLEX_SCREENSHOT-done', dataUrl)
    })
    .catch((err) => console.log(err))
})

/// ////////////////////////////
/// ////////////////////////////
/// ////////////////////////////

/**
 * Cleanup before page unloads
 */
window.addEventListener('beforeunload', unload)

function unload(e) {
  // Cancel the event
  e.preventDefault()

  // Remove IPC event listener
  ipcRenderer.removeAllListeners('requestData')

  // Remove listener
  document.removeEventListener('DOMContentLoaded', initiateBridge)

  // Remove eventlistener
  window.removeEventListener('beforeunload', unload)

  // Alert the parent!
  ipcRenderer.sendToHost('unload', 'Unload complete')

  // Chrome requires returnValue to be set
  // e.returnValue = '';

  // the absence of a returnValue property on the event will guarantee the browser unload happens
  delete e.returnValue
}

/// ////////////////////////////
/// ////////////////////////////
/// ////////////////////////////

const state = {
  isOrigin: false,
  id: '', // the ID of the parent - used for connection purposes
}

function getState() {
  return state
}

function startSync() {
  // Add listener for each event type
  for (const i in eventTypes) {
    console.log('Added listener:', eventTypes[i])
    document.addEventListener(eventTypes[i], responder, false)
  }

  // Fire off an event when the event occurs
  function responder(event) {
    event = event || window.event

    const { isOrigin } = getState()
    console.log('isOrigin', isOrigin)

    // if (!isOrigin) return false // Prevent the initiator

    // Unbind event temporarily
    // document.removeEventListener(event.type, responder)

    const getEventTarget = () => {
      console.log(window.event)
      console.log(event.target.outerHTML)

      const nodes = document.getElementsByTagName(event.target.tagName)
      const index = Array.prototype.indexOf.call(nodes, event.target)
      const eventElement = nodes[index]

      console.log(eventElement)

      if (eventElement) {
        return {
          element: eventElement.outerHTML,
          elementTagName: eventElement.tagName,
          index,
        }
      } else {
        return null
      }
    }

    const eventObj = {
      type: event.type,
      target: getEventTarget(), // Only set for clicks
    }

    // Send event to event bus
    ipcRenderer.sendToHost('REFLEX_SYNC', {
      event: eventObj,
      origin: {
        scrollHeight: document.documentElement.scrollHeight,
        offsetHeight: Math.max(
          document.documentElement.clientWidth,
          window.innerWidth || 0
        ),
        viewportHeight: helpers.documentHeight(),
        scrollOffset: {
          x: window.scrollX,
          y: window.scrollY,
        },
      },
    })
  }

  /// ////////////////////////////
  /// ////////////////////////////
  /// ////////////////////////////

  // API context bridge
  // https://www.electronjs.org/docs/tutorial/context-isolation
  // contextBridge.exposeInMainWorld('reflexSync', {
  //   doThing: () => ipcRenderer.send('do-a-thing'),
  // })

  // Set DOM effects via the renderer
  ipcRenderer.on('REFLEX_SYNC_setDOMEffect', (...args) => {
    if (getState().isOrigin === true) return false // Prevent effects in the origin
    console.log('Setting effect...')
    setDOMEffect(...args)
  })

  // Synchronize the state
  ipcRenderer.on('REFLEX_SYNC_setState', (event, { isOrigin }) => {
    console.log('set origin', isOrigin)
    state.isOrigin = isOrigin

    if (getState().isOrigin !== isOrigin) console.error('Origin mismatch')
  })
}
