// Required
import { app } from '../../index'

// Features
import * as artboardDimensions from '../artboard/artboard-dimensions'
import * as artboardListeners from '../artboard/artboard-listeners'
import * as artboardResize from '../artboard/artboard-resize'
import * as artboardAdd from '../artboard/artboard-add'
const $ = require('jquery')

export default class Artboard {
  constructor (width, height) {
    this.$el = $('.artboard') // TODO: Make this a specific object

    this.width = width
    this.height = height

    // Enable resizing on artboards
    artboardResize.init(this.$el)

    // Update all the artboard dimensions
    artboardDimensions.updateDimensions(this.$el)

    // TODO: First new button
    // this.createFirstNewButton();

    // Attach eventListeners
    artboardListeners.init()
  }

  // TODO: Feature add()
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
