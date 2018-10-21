// Libraries
// import {
//     $,
//     jQuery
// } from 'jquery';
// import * as panzoom from '../js/plugins/jquery.panzoom';

// Custom
// import Artboard from './features/artboard/artboard.js';

import Shift from "./shift";

let app = new Shift();
console.log(app);



// The app is written for the web by default
// So you can add a !isWeb flag to add native (Mac/Windows) features
// Checks by seeing if nw (NW.js) is defined
let nw = nw || null;

if (nw == null) {
    // App is on web
    app.platform = "web";
} else {
    // App is using NW.js (Mac/Windows app)
    app.platform = "native";
}



// Native (nw.js) functions
if (app.platform == "native") {
    // Make the NW window object accessible
    let win = nw.Window.get();

    // On load, show the app
    win.on("loaded", function () {
        win.show();
        win.focus();
    });

    // Open links in the native browser
    win.on('new-win-policy', function (frame, url, policy) {
        policy.ignore(); // Do not open using the app window
        nw.Shell.openExternal(url); // Open in external browser
    });

    // Log the current version in development
    if (app.environment == "dev") {
        console.log("Webkit Version: ", process.versions['node-webkit']);
    }
}

export default {
    app
}

// Canvas
// let canvas = artboards.panzoom({
//     increment: 0.5,
//     maxScale: 5,
//     minScale: 0.05,
//     startTransform: 'scale(' + Math.min(app.minScaleX, app.minScaleY) + ')'
// }).panzoom('zoom', true);

// Controls
// let canvasControls = {
//     container: $('#toolbar__canvas-controls'),
//     scale: $("#canvas-controls__scale"),
//     orientation: $("#canvas-controls__orientation"),
// }