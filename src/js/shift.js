/*
A Shift instance should contain:
- methods for artboards, canvas, etc.
- details about the environment
- details about the operating system
- list of artboards
- event listeners
*/

import Canvas from "./features/canvas/canvas";

// Create the main Shift class object
// This controls all details of the overall app
class Shift {
    constructor(options) {
        // Artboards
        this.artboards = {}; // keep track of all the artboards
        
        // Create a canvas
        this.canvas = new Canvas(this);

        // this.artboards = $("#artboards");
        // this.artboard = $(".artboard");
        // this.artboardInnerFrame = $("iframe");

        // Set initial scale
        // this.minScaleX = $(window).width() / artboards.innerWidth();
        // this.minScaleY = $(window).height() / artboards.innerHeight();
        // Artboard.add();
    }
}

export let shift = new Shift();