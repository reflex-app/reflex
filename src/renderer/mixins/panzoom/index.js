/* eslint-disable */
// 'use strict';

// import EventEmitter from 'events';
import * as pan from "./pan"
import {
  on,
  off
} from './utils'
import * as panzoomEvents from './events'
import kinetic from './kinetic'

export class Panzoom {
  constructor(element, parent, options = {}) {
    this.parent = parent
    this.element = element
    this.state = {
      isEnabled: false,
      isPanning: false,
      isZooming: false,
      isTouching: false
    }

    this.zoomIncrement = options.zoomIncrement || 1.15

    // Default Options
    this.options = options
    this.options.minZoom = options.minZoom || 0.1
    this.options.maxZoom = options.maxZoom || 10

    // Set the original matrix
    // This defaults to scale: 1
    // scaleX, ?, ?, scaleY, x, y
    this.transformMatrix = [1, 0, 0, 1, 0, 0]

    // This will keep track of events
    this._eventListener = {
      change: [],
      zoomStart: [],
      zoomStop: [],
      zoomIn: [],
      zoomOut: [],
      panStart: [],
      panStop: []
    }

    // Trigger initial functions
    this._init()
  }

  // ==================
  // Private

  // Set initial
  _init() {
    const _this = this

    // TODO temporary using null to avoid in tests
    const parent_styles = {
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      position: 'relative'
      // cursor: 'grab'
    }

    // Apply initial styles to parent
    Object.entries(parent_styles).forEach(
      ([key, value]) => {
        return _this.parent.style[key] = value
      }
    )

    const child_styles = {
      transform: `matrix(${this.transformMatrix})`, // Set the matrix
      transformOrigin: '50% 50%', // Enforce the default
      willChange: 'transform'
      // transformOrigin: '0 0'
    }

    // Apply initial styles to child
    Object.entries(child_styles).forEach(
      ([key, value]) => {
        return _this.element.style[key] = value
      }
    )

    // Enable Kinetic (inertia)
    // this.kinetic = kinetic({
    //   x: this.transformMatrix[4],
    //   y: this.transformMatrix[5]
    // }, scroll, this, this.options.kinetic)

    // Options
    if (this.options.startCentered) {
      // Center the child inside of the parent
      this.scaleToFit()
      this.center()
    }

    // Enable
    this.enable()
  }

  /**
   * Enable / Disable this plugin
   * @param {*} type
   */
  _bindStartEvents(type) {
    const fn = type === 'on' ? on : off

    // On/Off event listeners
    fn(this.parent, 'wheel', panzoomEvents.onWheel)
    fn(this.parent, 'dblclick', panzoomEvents.onDblClick)
    fn(document, 'keydown', panzoomEvents.onKeyDown)
    fn(this.parent, 'mousedown', panzoomEvents.onMouseDown)
  }

  /**
   * Update internal transform matrix + element transform
   * @param  {Array} transform
   */
  _updateTransform(transform) {
    // Round x, y to the nearest pixel
    // No sub-pixels
    transform[4] = Math.round(transform[4])
    transform[5] = Math.round(transform[5])

    // Update local variable
    this.transformMatrix = transform

    // Update Events.js context
    panzoomEvents._updateContext(this)

    // Update the CSS style
    this.element.style.transform = `matrix(${transform})`

    // Emit an event
    // TODO: emit an event
    // this._emit('change', evt)
  }

  /**
   * Center the child element relative to it's parent
   */
  center() {
    // Bounding box
    // const el = this.element.getBoundingClientRect();
    const el = this.element.getBoundingClientRect()
    const parentEl = this.parent.getBoundingClientRect()

    // Set the height, widths
    const elHeight = el.height
    const elWidth = el.width
    const parentHeight = parentEl.height
    const parentWidth = parentEl.width

    // console.log(elHeight, parentHeight, elWidth, parentWidth)

    // Prepare a new matrix from the current one
    let newMatrix = this.transformMatrix

    // Center the x, y positions
    // (origin: 0, 0)
    // newMatrix[4] = (parentWidth / 2) - (elWidth / 2);
    // newMatrix[5] = (parentHeight / 2) - (elHeight / 2);

    // newMatrix[4] = (parentWidth / 2) - (elWidth / 2);
    // newMatrix[5] = (parentHeight / 2) - (elHeight / 2);

    // (origin: 50, 50)
    newMatrix[4] = 0
    newMatrix[5] = 0

    // Update the matrix
    this.setTransform(newMatrix)
  }

  scaleToFit() {
    // Bounding box
    // const el = this.element.getBoundingClientRect();
    const el = this.element.getBoundingClientRect()
    const parentEl = this.parent.getBoundingClientRect()

    // Set the height, widths
    const elHeight = el.height
    const elWidth = el.width
    const parentWidth = parentEl.width
    const parentHeight = parentEl.height

    // Prepare a new matrix from the current one
    let newMatrix = this.transformMatrix
    // Get the current scale
    const currentScale = newMatrix[0]

    // If the child is outside of the parent, scale it down
    const childExceedsParent = !!((elWidth > parentWidth || elHeight > parentHeight));

    if (childExceedsParent) {
      // Scale down the child if it exceeds the parent
      const zoomAspectRatioX = parentWidth / elWidth
      const zoomAspectRatioY = parentHeight / elHeight

      const scale = (value) => {
        newMatrix[0] = value - 0.1 // TODO temporarily set to test zooming out
        newMatrix[3] = value - 0.1 // TODO temporarily set to test zooming out
        return newMatrix[0], newMatrix[3]
      };

      if (zoomAspectRatioX < 1 && zoomAspectRatioY < 1) {
        // console.log('1');
        scale(Math.min(parentWidth / (elWidth / currentScale), parentHeight / (elHeight / currentScale)))
      } else if (zoomAspectRatioX < 1) {
        // console.log('2');
        scale(parentWidth / (elWidth / currentScale))
      } else if (zoomAspectRatioY < 1) {
        // console.log('3');
        scale(parentHeight / (elHeight / currentScale))
      }
    }

    // Update the matrix
    this.setTransform(newMatrix)
  }

  /**
   * Scales the panzoom instance to fit a given DOM element
   * @TODO: This feature doesn't properly adjust to the given element
   */
  scaleToFitEl(domElement) {
    console.log(domElement)

    // Bounding box
    const el = domElement.getBoundingClientRect()
    const container = this.element.getBoundingClientRect()
    const parentEl = this.parent.getBoundingClientRect()

    // Set the height, widths
    const elHeight = el.height
    const elWidth = el.width
    const parentWidth = parentEl.width
    const parentHeight = parentEl.height

    // Prepare a new matrix from the current one
    let newMatrix = this.transformMatrix

    // Get the current scale
    const currentScale = newMatrix[0]

    // If the child is outside of the parent, scale it down
    const childExceedsParent = !!((elWidth > parentWidth || elHeight > parentHeight));

    // If bigger than the parent container
    if (childExceedsParent) {
      // Scale down the child if it exceeds the parent
      const zoomAspectRatioX = parentWidth / elWidth
      const zoomAspectRatioY = parentHeight / elHeight

      const scale = (value) => {
        newMatrix[0] = value
        newMatrix[3] = value
        return newMatrix[0], newMatrix[3]
      };

      if (zoomAspectRatioX < 1 && zoomAspectRatioY < 1) {
        scale(Math.min(parentWidth / (elWidth / currentScale), parentHeight / (elHeight / currentScale)))
      } else if (zoomAspectRatioX < 1) {
        scale(parentWidth / (elWidth / currentScale))
      } else if (zoomAspectRatioY < 1) {
        scale(parentHeight / (elHeight / currentScale))
      }
    } else {
      // Within the parent container
      // We need to adjust the x, y
      // The x should be the center of the container div -

      newMatrix[4] = parentWidth / elWidth
      newMatrix[5] = parentHeight / elHeight

      // Also, scale up this DOM element
      const scale = (value) => {
        newMatrix[0] = value
        newMatrix[3] = value
        return newMatrix[0], newMatrix[3]
      };
      // scale(Math.min(parentWidth / (elWidth / currentScale), parentHeight / (elHeight / currentScale)));

      console.log(this.transformMatrix, newMatrix)
    }

    // Update the matrix
    this.setTransform(newMatrix)
  }

  /**
   * Scales the contents to fit,
   * then centers the canvas on the screen
   */
  fitToScreen() {
    this.scaleToFit()
    this.center()
  }

  // ==================
  // Public

  /**
   * Resume panzoom event listeners
   */
  enable() {
    // Update event context
    panzoomEvents._updateContext(this)

    // Event Emitter
    // Setup an event emitter
    this._bindStartEvents('on')

    // Set isEnabled state
    this.state.isEnabled = true
  }

  /**
   * Pause panzoom event listeners
   */
  disable() {
    // Unbind event listeners
    // panzoomEvents._unbind(this);

    // Stop event emitting
    // TODO: Add tests for this
    this._bindStartEvents('off')

    // Set isEnabled state
    this.state.isEnabled = false
  }

  /**
   * Set the transform
   */
  setTransform(transform) {
    if (transform.length < 6) {
      throw new Error('Please pass in a correct matrix (example: [1,0,0,1,0,0])')
    }

    this._updateTransform(transform)
  }

  /**
   * Returns the current transform
   */
  getTransform() {
    return this.transformMatrix
  }

  /**
   * Emits an event
   * @param {String} event
   */
  _emit(event, evt) {
    let ok = true

    for (const listener of this._eventListener[event]) {

      ok = listener.call(this, {
        inst: this,
        oe: evt
      }) && ok
    }

    return ok
  }

  /**
   * Adds an eventlistener
   * @param event
   * @param cb
   */
  on(event, cb) {
    if (!this._eventListener[event]) throw new Error(`Event not setup ${event} ${cb}`)

    this._eventListener[event].push(cb)
    return this
  }

  /**
   * Removes an event listener
   * @param event
   * @param cb
   */
  off(event, cb) {
    const callBacks = this._eventListener[event]

    if (callBacks) {
      const index = callBacks.indexOf(cb)

      if (~index) {
        callBacks.splice(index, 1)
      }
    }

    return this
  }




  _zoom(args) {
    const matrix = this.transformMatrix // Current transform matrix [0,0,0,0,0,0]
    const currentScale = matrix[0] // Current zoom
    let nextScale // Next zoom
    const transformX = matrix[4]
    const transformY = matrix[5]

    switch (args) {
      case 'in':
        nextScale = currentScale * this.zoomIncrement
        break
      case 'out':
        nextScale = currentScale / this.zoomIncrement
        break
    }

    // Tidy/validate the number
    // TODO Fix "this" definition
    const that = this;

    function protectScale(scale) {
      // @TODO: Bug: scale gets stuck here
      // Prevent min/max scale
      if (scale < that.options.minZoom) {
        scale = that.options.minZoom
      } else if (scale > that.options.maxZoom) {
        scale = that.options.maxZoom
      }

      // Prettify the number
      scale = parseFloat(scale.toFixed(10))

      // Return a nice number
      return scale
    }

    nextScale = protectScale(nextScale)

    // Update the scale
    matrix[0] = nextScale
    matrix[3] = nextScale

    const output = [
      nextScale, // scale
      matrix[1], // get existing rotation
      matrix[2], // get existing rotation
      nextScale, // scale
      transformX, // x
      transformY // y
    ]

    // Update the Panzoom internal matrix
    this.setTransform(output)
  }

  /**
   * Zoom In
   */
  zoomIn() {
    const event = new CustomEvent('zoomIn');
    this._emit('zoomIn', event)
    this._zoom('in')
  }

  /**
   * Zoom Out
   */
  zoomOut() {
    const event = new CustomEvent('zoomOut');
    this._emit('zoomOut', event)
    this._zoom('out')
  }


  /**
   * Set the canvas to x, y
   * @param {*} x px value
   * @param {*} y px value
   */
  panToElement(el) {
    pan.panToElement(el)
  }
}