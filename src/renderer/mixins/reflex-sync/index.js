/**
 * NOTE: This all happens in the Webview context
 * Communicate with renderer process (WebPage.vue) via ipcRenderer.sendToHost()
 */
const { ipcRenderer } = require('electron')
const setDOMEffect = require("./lib/effects");
const eventTypes = require("./lib/eventTypes")

let state = {
    isScrolling: false
}

// Add listener for each event type
for (let i in eventTypes) {
    console.log('Added listener:', eventTypes[i])
    document.addEventListener(eventTypes[i], () => {
        if (!state.scrolling) {
            ipcRenderer.sendToHost("REFLEX_SYNC", {
                eventType: eventTypes[i],
                // DOMElement: '',
                scrollOffset: {
                    top: window.scrollY,
                    left: window.scrollX
                }
            });
        }
    });
}

// Set DOM effects via the renderer
ipcRenderer.on('REFLEX_SYNC_setDOMEffect', (...args) => {
    setDOMEffect(...args)
})











///////////////////////////////
///////////////////////////////
///////////////////////////////

/**
 * Collect and send back information from the document context
 */
document.addEventListener("DOMContentLoaded", dataCollector);

function dataCollector() {
    let data = {
        title: document.title,
        favicon: "https://www.google.com/s2/favicons?domain=" +
            window.location.href
    }

    ipcRenderer.once('requestData', () => {
        ipcRenderer.sendToHost('replyData', data)
        document.removeEventListener('DOMContentLoaded', dataCollector)
    })
}

///////////////////////////////
///////////////////////////////
///////////////////////////////

/**
 * Cleanup before page unloads
 */
window.addEventListener('beforeunload', unload);

function unload(e) {
    // Cancel the event
    e.preventDefault();

    // Remove IPC event listener
    ipcRenderer.removeAllListeners('requestData')

    // Remove listener
    document.removeEventListener('DOMContentLoaded', dataCollector)

    // Remove eventlistener
    window.removeEventListener('beforeunload', unload)

    // Alert the parent!
    ipcRenderer.sendToHost('unload', 'Unload complete')

    // Chrome requires returnValue to be set
    // e.returnValue = '';

    // the absence of a returnValue property on the event will guarantee the browser unload happens
    delete e['returnValue'];
}