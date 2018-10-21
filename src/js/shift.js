/*
    A Shift instance should contain:
    - methods for artboards, canvas, etc.
    - details about the environment
    - details about the operating system
    - list of artboards
    - event listeners
*/

// Create the main Shift class object
// This controls all details of the overall app
export class Shift {
    constructor(options) {
        // Artboards
        this.artboards = {}; // keep track of all the artboards

        // this.artboards = $("#artboards");
        // this.artboard = $(".artboard");
        // this.artboardInnerFrame = $("iframe");
        // Set initial scale
        // this.minScaleX = $(window).width() / artboards.innerWidth();
        // this.minScaleY = $(window).height() / artboards.innerHeight();
        // Artboard.add();
    }
}