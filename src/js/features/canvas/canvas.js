const $ = require('jquery');
const panzoom = require('../../plugins/jquery.panzoom');

// Import any sub-modules
import canvasPanAndZoom from './canvas-pan-and-zoom';
import * as canvasSize from './canvas-size';

export default class Canvas {
    constructor(app) {
        this.app = app; // Inherit from Shift

        // DOM elements
        this.$artboards = $("#artboards");
        this.$artboard = $(".artboard");
        this.$artboardInnerFrame = $("iframe");

        // Set scale
        this.minScaleX = $(window).width() / this.$artboards.innerWidth();
        this.minScaleY = $(window).height() / this.$artboards.innerHeight();

        // Create a canvas
        this.create();

        // Make the canvas pan-able
        canvasPanAndZoom(this.$artboards);
    }

    create() {
        // Creates a panzoom instance (aka "Canvas")
        let canvas = this.$artboards.panzoom({
            increment: 0.5,
            maxScale: 5,
            minScale: 0.05,
            startTransform: 'scale(' + Math.min(this.minScaleX, this.minScaleY) + ')'
        }).panzoom('zoom', true);
    }

    updateZoomScale() {
        // Update the size
        canvasSize.updateScale('fromCanvas');
    }

}

// @TODO: These should be organized better...with toolbar?
// Controls
let canvasControls = {
    container: $('#toolbar__canvas-controls'),
    scale: $("#canvas-controls__scale"),
    orientation: $("#canvas-controls__orientation"),
}

// console.log(new Canvas());