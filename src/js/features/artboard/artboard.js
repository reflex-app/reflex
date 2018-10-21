const $ = require('jquery');
import { app } from "../../index";

import { updateDimensions, returnDimensions } from "../artboard/artboard-dimensions";
import { artboardListeners } from "../artboard/artboard-listeners";
import addArtboard from "../artboard/artboard-add";

export default class Artboard {
    constructor(options) {
        this.$el = $('.artboard');

        // Attach eventListeners
        artboardListeners();
        
        // Update all the artboard dimensions
        // updateDimensions(this.$el);

        // this.createFirstNewButton();

        // Dimensions
        // this.dimensions.init();
        // Resizable artboard
        // this.resize.init();
        // Add artboards
    }

    add(placement, event, width, height, fn) {
        addArtboard(placement, event, width, height, fn);
    }
}

// Usage:
// var artboard = new Artboard();
// artboard.add("before", this, 500, 800);

// function init() {
//     // Dimensions
//     app.artboard.dimensions.init();
//     // Resizable artboard
//     app.artboard.resize.init();
//     // Add artboards
//     app.artboard.watchers.init();

//     // Any functions that need to fire on first load
//     // Defined below
//     app.artboard.firstLoad();
// }

// function firstLoad() {
//     app.artboard.createFirstNewButton();
// }

// export default {
//     init,
//     firstLoad
// }