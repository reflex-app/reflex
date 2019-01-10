// Required
import { app } from '../../index'
const $ = require('jquery')

// Features
import * as artboardDimensions from '../artboard/artboard-dimensions'
import * as artboardListeners from '../artboard/artboard-listeners'
import * as artboardResize from '../artboard/artboard-resize'
import * as artboardAdd from '../artboard/artboard-add'

export default class Artboard {
  constructor (element) {
    this.$el = $('.artboard'); // TODO: Make this dynamic (relies on jQuery)
    this.artboardsList = []; // Stores all the DOM elements (artboards)

    // Enable resizing on artboards
    artboardResize.init(this.$el)

    // Update all the artboard dimensions
    artboardDimensions.updateDimensions(this.$el)
    
    // Attach eventListeners
    artboardListeners.init()
    
    // TODO: First new button
    // this.createFirstNewButton();
  }

  static createArtboard(width, height) {
    const element = document.createElement('li');
    element.textContent = "something"
    return element;
  }

  update() {
    // Clear the existing element
    // while (this.$el.length > -1) {
    //   $(this.$el).remove();
    // }

    // Generate all the artboards
    $(this).append(Artboard.createArtboard)
  }

  // TODO: Feature add()
  add() {

  }
}

// Usage:
// const element = document.getElementById("artboards")
// let artboard = new Artboard(element);
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
