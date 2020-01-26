const { ipcRenderer } = require('electron')

/**
 * Collect and send back information from the document context
 */
document.addEventListener("DOMContentLoaded", dataCollector);

/**
 * Stream back information inside the document
 */
document.addEventListener("mouseover", function (e) {
    // let hoveredEl = e.target;
    // if (hoveredEl.tagName !== "A" || hoveredEl.tagName !== "A") return
    ipcRenderer.sendToHost("mouseover-href", e.target);
});

/**
 * Cleanup before page unloads
 */
window.addEventListener('beforeunload', unload);

///////////////////////////////
///////////////////////////////
///////////////////////////////

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