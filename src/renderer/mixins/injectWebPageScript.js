const { ipcRenderer } = require('electron')

// document.addEventListener("mouseover", function (e) {
//     let hoveredEl = e.target;
//     if (hoveredEl.tagName !== "A") {
//         return;
//     }
//     ipcRenderer.sendToHost("mouseover-href", e);
// });

function dataCollector() {
    let data = {
        title: document.title,
        favicon: "https://www.google.com/s2/favicons?domain=" +
            window.location.href
    }

    ipcRenderer.on('requestData', () => {
        ipcRenderer.sendToHost('replyData', data)
    })
}

// Define the content from inside the page to return
document.addEventListener("DOMContentLoaded", dataCollector);

// Wait for page to be unloaded
window.addEventListener('beforeunload', function (e) {
    // Cancel the event
    e.preventDefault();

    // Remove listener
    window.removeEventListener('DOMContentLoaded', dataCollector)

    // the absence of a returnValue property on the event will guarantee the browser unload happens
    delete e['returnValue'];
});