/* eslint-disable */
'use strict';

import * as pan from "./pan"
import * as zoom from "./zoom"
import * as panzoomEvents from "./events"
import EventEmitter from 'events';
import kinetic from "./kinetic"

export class Panzoom {
  constructor(element, parent, options) {
    this.element = element;
    this.parent = parent;
    this.state = {
      isEnabled: false,
      isPanning: false,
      isZooming: false,
      isTouching: false
    }

    this.zoomIncrement = options.zoomIncrement || 1.15;

    // Options (with defaults)
    this.options = options || {};
    this.options.minZoom = options.minZoom || 0.1;
    this.options.maxZoom = options.maxZoom || 10;

    // Set the original matrix
    // This defaults to scale: 1
    // scaleX, ?, ?, scaleY, x, y
    this.transformMatrix = [1, 0, 0, 1, 0, 0];

    this.emitter = new EventEmitter; // Stores an EventEmitter

    // The events that can be emitted/listened to
    this.events = {
      change: 'panzoom:change',
      zoom: 'panzoom:zoom',
      pan: 'panzoom:pan'
    }

    // Trigger initial functions
    this._init();
  }

  // ==================
  // Private

  // Set initial
  _init() {
    let _this = this;

    const parent_styles = {
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      position: 'relative',
      // cursor: 'grab'
    }

    // Apply initial styles to parent
    Object.entries(parent_styles).forEach(
      ([key, value]) => {
        return _this.parent.style[key] = value;
      }
    );

    const child_styles = {
      transform: `matrix(${this.transformMatrix})`, // Set the matrix
      transformOrigin: '50% 50%' // Enforce the default
      // transformOrigin: '0 0'
    }

    // Apply initial styles to child
    Object.entries(child_styles).forEach(
      ([key, value]) => {
        return _this.element.style[key] = value;
      }
    );

    // Set isEnabled state
    this.state.isEnabled = true;

    // Bind event listeners
    panzoomEvents._bind(this);

    // Event Emitter
    // Setup an event emitter
    this._eventEmitterInit();

    // Enable Kinetic (inertia)
    this.kinetic = kinetic({
      x: this.transformMatrix[4],
      y: this.transformMatrix[5]
    }, scroll, this, this.options.kinetic);

    // Options
    if (this.options.startCentered) {
      // Center the child inside of the parent
      this.scaleToFit();
      this.center();
    }
  }

  /**
   * Update internal transform matrix + element transform
   * @param  {Array} transform 
   */
  _updateTransform(transform) {
    // Round x, y to the nearest pixel
    // No sub-pixels
    transform[4] = Math.round(transform[4]);
    transform[5] = Math.round(transform[5]);

    // Update local variable
    this.transformMatrix = transform;

    // Update Events.js context
    panzoomEvents._updateContext(this);

    // Update the CSS style
    this.element.style.transform = `matrix(${transform})`;

    // Emit an event
    // TODO: emit an event
    this.emit('panzoom:change');
  }

  /**
   * Handler for emitted events
   * @param {Function} event 
   */
  _eventEmitterHandler(event) {
    // console.log('event fired: ', event);
    this.on(event); // Trigger any public .on() listeners
    return true;
  }

  /**
   * Initialize an event emitter which communicates from the DOM element
   */
  _eventEmitterInit() {
    // Push out events to listeners
    // @TODO: This is currently binding too many times
    // Object.values(this.events).forEach((event) => {
    //   this.emitter.on(event, this._eventEmitterHandler.bind(this, event));
    // });

    // // Watch for errors
    // this.emitter.on('error', (err) => {
    //   console.error('Error delivering message.');
    // });
  }

  /** Remove existing event emitter */
  _eventEmitterRemove() {
    // Remove the listeners
    // TODO: Test that this properly removes
    Object.values(this.events).forEach((event) => {
      this.emitter.removeAllListeners(event, this._eventEmitterHandler);
    });
  }

  /**
   * Center the child element relative to it's parent
   */
  center() {
    // Bounding box
    // const el = this.element.getBoundingClientRect();
    const el = this.element.getBoundingClientRect();
    const parentEl = this.parent.getBoundingClientRect();

    // Set the height, widths
    const elHeight = el.height;
    const elWidth = el.width;
    const parentHeight = parentEl.height;
    const parentWidth = parentEl.width;

    // console.log(elHeight, parentHeight, elWidth, parentWidth)

    // Prepare a new matrix from the current one
    let newMatrix = this.transformMatrix;

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
    this.setTransform(newMatrix);
  }

  scaleToFit() {
    // Bounding box
    // const el = this.element.getBoundingClientRect();
    const el = this.element.getBoundingClientRect();
    const parentEl = this.parent.getBoundingClientRect();

    // Set the height, widths
    const elHeight = el.height;
    const elWidth = el.width;
    const parentWidth = parentEl.width;
    const parentHeight = parentEl.height;

    // Prepare a new matrix from the current one
    let newMatrix = this.transformMatrix;
    // Get the current scale
    const currentScale = newMatrix[0];

    // If the child is outside of the parent, scale it down
    const childExceedsParent = (elWidth > parentWidth || elHeight > parentHeight) ? true : false;

    if (childExceedsParent) {
      // Scale down the child if it exceeds the parent
      const zoomAspectRatioX = parentWidth / elWidth;
      const zoomAspectRatioY = parentHeight / elHeight;

      const scale = (value) => {
        newMatrix[0] = value;
        newMatrix[3] = value;
        return newMatrix[0], newMatrix[3];
      };

      if (zoomAspectRatioX < 1 && zoomAspectRatioY < 1) {
        scale(Math.min(parentWidth / (elWidth / currentScale), parentHeight / (elHeight / currentScale)));
      } else if (zoomAspectRatioX < 1) {
        scale(parentWidth / (elWidth / currentScale));
      } else if (zoomAspectRatioY < 1) {
        scale(parentHeight / (elHeight / currentScale));
      }
    }

    // Update the matrix
    this.setTransform(newMatrix);
  }

  /** 
   * Scales the panzoom instance to fit a given DOM element
   * @TODO: This feature doesn't properly adjust to the given element
   */
  scaleToFitEl(domElement) {
    console.log(domElement);

    // Bounding box
    const el = domElement.getBoundingClientRect();
    const container = this.element.getBoundingClientRect()
    const parentEl = this.parent.getBoundingClientRect();

    // Set the height, widths
    const elHeight = el.height;
    const elWidth = el.width;
    const parentWidth = parentEl.width;
    const parentHeight = parentEl.height;

    // Prepare a new matrix from the current one
    let newMatrix = this.transformMatrix;

    // Get the current scale
    const currentScale = newMatrix[0];

    // If the child is outside of the parent, scale it down
    const childExceedsParent = (elWidth > parentWidth || elHeight > parentHeight) ? true : false;

    // If bigger than the parent container
    if (childExceedsParent) {
      // Scale down the child if it exceeds the parent
      const zoomAspectRatioX = parentWidth / elWidth;
      const zoomAspectRatioY = parentHeight / elHeight;

      const scale = (value) => {
        newMatrix[0] = value;
        newMatrix[3] = value;
        return newMatrix[0], newMatrix[3];
      };

      if (zoomAspectRatioX < 1 && zoomAspectRatioY < 1) {
        scale(Math.min(parentWidth / (elWidth / currentScale), parentHeight / (elHeight / currentScale)));
      } else if (zoomAspectRatioX < 1) {
        scale(parentWidth / (elWidth / currentScale));
      } else if (zoomAspectRatioY < 1) {
        scale(parentHeight / (elHeight / currentScale));
      }
    } else {
      // Within the parent container
      // We need to adjust the x, y
      // The x should be the center of the container div - 

      newMatrix[4] = parentWidth / elWidth;
      newMatrix[5] = parentHeight / elHeight;

      // Also, scale up this DOM element
      const scale = (value) => {
        newMatrix[0] = value;
        newMatrix[3] = value;
        return newMatrix[0], newMatrix[3];
      };
      // scale(Math.min(parentWidth / (elWidth / currentScale), parentHeight / (elHeight / currentScale)));

      console.log(this.transformMatrix, newMatrix);
    }

    // Update the matrix
    this.setTransform(newMatrix);
  }

  /**
   * Scales the contents to fit, 
   * then centers the canvas on the screen
   */
  fitToScreen() {
    this.scaleToFit();
    this.center();
  }

  // ==================
  // Public

  /**
   * Resume panzoom event listeners
   */
  resume() {
    // Re-bind event listeners
    panzoomEvents._bind(this);

    // Event Emitter
    // Setup an event emitter
    this._eventEmitterInit();

    // Set isEnabled state
    this.state.isEnabled = true;
  }

  /**
   * Pause panzoom event listeners
   */
  pause() {
    // Unbind event listeners
    panzoomEvents._unbind(this);

    // Stop event emitting
    // TODO: Add tests for this
    this._eventEmitterRemove();

    // Set isEnabled state
    this.state.isEnabled = false;
  }

  /**
   * Set the transform
   */
  setTransform(transform) {
    if (transform.length < 6) {
      throw new Error('Please pass in a correct matrix (example: [1,0,0,1,0,0])')
    }

    this._updateTransform(transform);
  }

  /**
   * Returns the current transform
   */
  getTransform() {
    return this.transformMatrix
  }

  /**
   * Zoom In
   */
  zoomIn() {
    zoom.zoomIn(this)
  }

  /**
   * Zoom Out
   */
  zoomOut() {
    zoom.zoomOut(this);
  }

  /**
   * Emits an event
   * @param {String} event 
   */
  emit(event) {
    this.emitter.emit(event);
  }

  /**
   * Fires a callback when the specified event is fired 
   * @param {String} event 
   * @param {Function} callback 
   */
  on(event, callback) {
    // TODO: This is causing a memory leak when called multiple times
    this.emitter.on(event, () => {
      if (callback) callback();
    })
  }

}

export default function panzoomInit(domElement, parentElement, pluginOptions) {
  if (!domElement || domElement.nodeType !== 1 || !parentElement || parentElement.nodeType !== 1) {
    throw new Error('Please pass in a DOM element as the domElement. For example, document.getElementById("myElement") or with jQuery $("#myElement")');
  }

  pluginOptions = pluginOptions || {};

  try {
    const instance = new Panzoom(domElement, parentElement, pluginOptions);
    document.$panzoom = instance; // Attach to document
    // console.log(instance);
    return instance;
  } catch (err) {
    throw new Error(err)
  }
}