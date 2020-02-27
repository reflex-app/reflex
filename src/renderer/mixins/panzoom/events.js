/* eslint-disable */
// Functions related to event listeners
'use strict';

import * as pan from './pan';
import * as zoom from './zoom';

// COMMANDS
// PAN
// Space + Mouse = Drag

// ZOOM
// CMD/CTRL + Scroll = Zoom In/Out
// Pinch In/Out = Zoom In/Out

// TODO: _context can be outdated if the user has changed the internals via another function; it should not be cached
let _context, // This is set to the Panzoom Class during _bind()
  canvasNeedsRender = true, // Enabled on start; keeps track of the requestAnimationFrame
  mouseX, // used for touch position
  mouseY, // used for touch position
  spacebar = false

// ====================

export function _updateContext(context) {
  _context = context;
}

/**
 * Release all mouse event listeners
 */
function _releaseMouseEvents() {
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
}

// ==================
// KEYS
export function onKeyDown(event) {
  if (event.code == 'Space') {
    spacebar = true
    
    // TODO Find a better way to handle the pan interaction
    // Change the cursor
    document.body.style.cursor = "grab"

    _context._emit('panStart', event) // Emit the event (even though we're waiting)
  } else {
    spacebar = false
  }

  // Temporarily for key up
  document.addEventListener('keyup', onKeyUp)

  function onKeyUp() {
    // Return to normal cursor
    document.body.style.cursor = "auto"

    // Reset state
    spacebar = false

    document.removeEventListener('keyup', onKeyUp)
    // TODO Find a better way to handle the pan interaction
    // Currently starting at this point to prevent other interactions
    // like drag to select
    _context._emit('panStop', event) // Emit the event (even though we're waiting)
  }
}


// ==================
// MOUSEDOWN
export function onMouseDown(e) {
  if (e.which !== 1) return false; // Only accept left clicks

  // if (e.target !== "webview.frame")
  e.preventDefault();

  if (_context.state.isTouching) {
    // Check if touch event is in progress
    // If so, cancel this event; touch is handled separately
    e.stopPropagation()
    return false
  }

  // Space must also be pressed...
  // Then start panning!
  if (spacebar) {
    // Start panning
    pan.start(e, _context);

    // Events when mouse is down & moving
    document.addEventListener('mousemove', onMouseMove);
  }

  // Events when mouse lets go
  document.addEventListener('mouseup', onMouseUp);

  return false; // Don't bubble up
}

function onMouseUp(e) {
  // Stop panning
  pan.end(e, _context);

  // Change the cursor
  document.body.style.cursor = "auto"

  // End all mouse-related events
  _releaseMouseEvents(e);
}

// ==================
// MOUSEMOVE
function onMouseMove(e) {
  // NOTE: The following functions will be called frequently
  // Use requestAnimationFrame to trigger on need

  // Panning
  if (spacebar)
    document.body.style.cursor = "grabbing" // Change the cursor

  // Check if the canvas needs a new frame
  if (canvasNeedsRender && _context.state.isPanning) {
    canvasNeedsRender = false; // Disable until we setTransform the frame

    // Request 60fps animation
    requestAnimationFrame(function () { // TODO: Test that this is really working
      canvasNeedsRender = true;
      pan.pan(e, _context);
    });
  }
}

// ==================
// Mouse wheel or touch panning
export function onWheel(event) {
  // Prevent default zoom event
  // With trackpads, this prevents accidental pinch zooming of the whole page
  event.preventDefault();

  // If holding 
  if (event.ctrlKey || event.metaKey || event.altKey) {
    // Mac pinch-to-zoom
    zoom.zoom(_context, event, {
      relative: true
    });
  } else {
    // Non-touch devices
    pan.panXY(_context, event)
  }
}

// ===============
// TODO: Organize placement of this function
function getOffsetXY(e) {
  let offsetX, offsetY,
    element = _context.parent.getBoundingClientRect();

  offsetX = e.clientX - element.left
  offsetY = e.clientY - element.top

  return {
    x: offsetX,
    y: offsetY
  };
}

/**
 * Double Click = Zoom In
 */
export function onDblClick(e) {
  zoom.zoomIn(_context, e, true);
}
