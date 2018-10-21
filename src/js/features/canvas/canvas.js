const $ = require('jquery');
const panzoom = require('../../plugins/jquery.panzoom');

// Import any sub-modules
import canvasPanAndZoom from './canvas-pan-and-zoom';
import * as canvasSize from './canvas-size';

export class Canvas {
    constructor(app) {
        // DOM elements
        this.$artboards = $("#artboards");
        this.$artboard = $(".artboard");
        this.$artboardInnerFrame = $("iframe");

        // Set scale
        this.minScaleX = $(window).width() / this.$artboards.innerWidth();
        this.minScaleY = $(window).height() / this.$artboards.innerHeight();

        // Create a canvas
        this.$canvas = this.create();

        // Update the current scale of the canvas
        canvasSize.updateScale('fromCanvas', this.$canvas);

        // Create a window resize event listener
        // This will update the zoom scale on resize
        canvasSize.setEventListeners(this.$canvas);

        // Make the canvas pan-able
        canvasPanAndZoom(this.$artboards);
    }

    create() {
        // Creates a panzoom instance (aka "Canvas")
        return this.$artboards.panzoom({
            increment: 0.5,
            maxScale: 5,
            minScale: 0.05,
            startTransform: 'scale(' + Math.min(this.minScaleX, this.minScaleY) + ')'
        }).panzoom('zoom', true);
    }

}

// TODO: These should be organized better...with toolbar?
// Controls
let canvasControls = {
    container: $('#toolbar__canvas-controls'),
    scale: $("#canvas-controls__scale"),
    orientation: $("#canvas-controls__orientation"),
}

// console.log(new Canvas());