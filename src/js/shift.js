/*
A Shift instance should contain:
- details about the environment
- details about the operating system
- methods for artboards, canvas, etc.
- list of artboards
- event listeners
*/

import { Canvas } from "./features/canvas/canvas";
import { Settings } from "./features/settings/settings";

// Create the main Shift class object
// This controls all details of the overall app
class Shift {
    constructor() {
        this.environment = this.getEnvironment();
        this.platform = this.getPlatform();

        this.events = {
            // If an artboard is selected
            isOnArtboard: false,
            // If the canvas is zooming/panning
            isChangingCanvas: false,
            // If resizing an artboard (resize.js)
            isResizingArtboard: false
        };

        // Artboards
        this.artboards = {}; // keep track of all the artboards

        // Create a canvas
        this.canvas = new Canvas(this);

        // Settings
        this.settings = new Settings(this);
    }

    getEnvironment() {
        // Check if this a dev or production environment
        let currentURL = new URL(window.location.href);
        if (currentURL.hostname.includes("localhost")) {
            console.log("Environment: development");
            return "dev";
        } else {
            console.log("Environment: production");
            return "production";
        }
    }

    getPlatform() {
        // The app is written for the web by default
        // So you can add a !isWeb flag to add native (Mac/Windows) features
        // Checks by seeing if nw (NW.js) is defined
        let nw = window.nw || null;

        if (nw == null) {
            // App is on web
            return "web";
        } else {
            // App is using NW.js (Mac/Windows app)
            let win = nw.Window.get();

            // Open links in the native browser
            win.on('new-win-policy', function (frame, url, policy) {
                policy.ignore(); // Do not open using the app window
                nw.Shell.openExternal(url); // Open in external browser
            });

            // Log the current version in development
            if (this.environment == "dev") {
                console.log("NW.js Version: ", window.process.versions['node-webkit']);
            }

            return "native";
        }
    }
}

export let shift = new Shift();