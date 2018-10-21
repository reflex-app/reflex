import { app } from "../../index";
import addArtboard from "../artboard/artboard-add";

export default class Artboard {
    constructor() {
        this.app = app;

        // Dimensions
        // this.dimensions.init();
        // Resizable artboard
        // this.resize.init();
        // Add artboards
        // this.watchers.init();

        // Any functions that need to fire on first load
        // Defined below
        this.firstLoad();
    }

    add(placement, event, width, height, fn) {
        addArtboard(placement, event, width, height, fn);
    }

    // Other functions
    firstLoad() {
        // this.createFirstNewButton();
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