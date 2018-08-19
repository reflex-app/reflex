// Global Namespace
// Additional functions can use `boomerang.fn()` format
var app = {};

app.events = {
    // If an artboard is selected
    isOnArtboard: false,
    // If the canvas is zooming/panning
    isChangingCanvas: false,
    // If resizing an artboard (resize.js)
    isResizingArtboard: false
};

// Artboards
var artboards = $("#artboards");
var artboard = $(".artboard");
var artboardInnerFrame = $("iframe");

// Set initial scale
app.minScaleX = $(window).width() / artboards.innerWidth();
app.minScaleY = $(window).height() / artboards.innerHeight();

// Canvas
var canvas = artboards.panzoom({
    increment: 0.1,
    maxScale: 5,
    minScale: 0.05,
    startTransform: 'scale(' + Math.min(app.minScaleX, app.minScaleY) + ')'
}).panzoom('zoom', true);

// Controls
var canvasControls = {
    container: $('#toolbar__canvas-controls'),
    scale: $("#canvas-controls__scale"),
    orientation: $("#canvas-controls__orientation"),
}

// ==================================================
// Artboards
// ==================================================
// Resize Handles
var resize_handle__right = $(".handle__right");
var resize_handle__bottom = $(".handle__bottom");

// Watch for when an artboard is being resized
if (app.events.isResizingArtboard == true) {
    canvas.panzoom("isDisabled")
}

// var mouse_position; // helps locate items to delete in context menu