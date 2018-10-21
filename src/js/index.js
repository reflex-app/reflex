// Import any required scripts
const $ = require('jquery');
const panzoom = require('../js/plugins/jquery.panzoom');

import { shift } from "./shift"; // Load Shift class
export let app = shift; // Create the main instance
console.log(app);

///////////////////////////////
///////////////////////////////

// Check if this a dev or production environment
let currentURL = new URL(window.location.href);
if (currentURL.hostname.includes("localhost")) {
    console.log("Environment: development");
    app.environment = "dev";
} else {
    console.log("Environment: production");
    app.environment = "production";
}

// The app is written for the web by default
// So you can add a !isWeb flag to add native (Mac/Windows) features
// Checks by seeing if nw (NW.js) is defined
let nw = window.nw || null;

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

    // Open links in the native browser
    win.on('new-win-policy', function (frame, url, policy) {
        policy.ignore(); // Do not open using the app window
        nw.Shell.openExternal(url); // Open in external browser
    });

    // Log the current version in development
    if (app.environment == "dev") {
        console.log("NW.js Version: ", process.versions['node-webkit']);
    }
}

///////////////////////////////
///////////////////////////////
// @TODO: The following could be part of a Canvas class?


///////////////////////////////
///////////////////////////////

// Import modules
require('../js/features/artboard/artboard');