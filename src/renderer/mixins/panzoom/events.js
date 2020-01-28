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
 * Bind event listeners
 * @param {Class} context Inherits the context of the Panzoom Class  
 * Pass the context along to any event that needs access to Panzoom methods/variables
 */
// export function _bind(context) {
//   // Scroll-based events
//   context.parent.addEventListener('wheel', onWheel); // @TODO: This should be debounced
//   context.parent.addEventListener('dblclick', onDblClick);

//   // Watching for keys
//   document.addEventListener('keydown', onKeyDown);

//   // Bind event listeners
//   context.parent.addEventListener('mousedown', onMouseDown);
//   // context.parent.addEventListener('touchstart', onTouchStart);

//   // Gestures
//   // context.parent.addEventListener('gesturestart', onGestureStart);
//   // context.parent.addEventListener('gesturechange', onGestureChange);
//   // context.parent.addEventListener('gestureend', onGestureEnd);
// }

/**
 * Unbind all event listeners
 */
// export function _unbind(context) {
//   context.parent.removeEventListener('wheel', onWheel);
//   context.parent.removeEventListener('dblclick', onDblClick);


//   document.removeEventListener('keydown', onKeyDown);

//   context.parent.removeEventListener('mousedown', onMouseDown);
//   // context.parent.removeEventListener('touchstart', onTouchStart);

//   // Gestures
//   // context.parent.removeEventListener('gesturestart', onGestureStart);
//   // context.parent.removeEventListener('gesturechange', onGestureChange);
//   // context.parent.removeEventListener('gestureend', onGestureEnd);
// }

/**
 * Release all mouse event listeners
 */
function _releaseMouseEvents() {
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
}

/**
 * Release all touch event listeners
 */
function _releaseTouches() {
  document.removeEventListener('touchmove', handleTouchMove)
  document.removeEventListener('touchend', handleTouchEnd)
  document.removeEventListener('touchcancel', handleTouchEnd)
}

// ==================
// KEYS
export function onKeyDown(event) {
  if (event.code == 'Space') {
    spacebar = true
    // TODO Find a better way to handle the pan interaction
    // Currently starting at this point to prevent other interactions
    // like drag to select

    // Change the cursor
    document.body.style.cursor = "grab"

    _context._emit('panStart', event) // Emit the event (even though we're waiting)
  } else {
    spacebar = false
  }



  // Listen for key up
  document.addEventListener('keyup', onKeyUp)

  function onKeyUp() {
    // Return to normal cursor
    document.body.style.cursor = "auto"

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
  if (spacebar) {
    // Change the cursor
    document.body.style.cursor = "grabbing"
  }


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
// Touch events

function onTouchStart(e) {
  e.stopPropagation()
  e.preventDefault() // Prevent default mousedown event

  if (e.touches.length === 1) {
    // Should start panning if is dragging
    function handleSingleFingerTouch(e) {
      var touch = e.touches[0]
      var offset = getOffsetXY(touch)
      mouseX = offset.x
      mouseY = offset.y

      function startTouchListenerIfNeeded() {
        if (!_context.state.isPanning) {
          pan.start(e, _context);
          document.addEventListener('touchmove', handleTouchMove)
          document.addEventListener('touchend', handleTouchEnd)
          document.addEventListener('touchcancel', handleTouchEnd)
        }
      }

      startTouchListenerIfNeeded()
    }

    return handleSingleFingerTouch(e, e.touches[0])
  } else if (e.touches.length === 2) {
    // handleTouchMove() will care about pinch zoom.    

    // function getPinchZoomLength(finger1, finger2) {
    //   return Math.sqrt((finger1.clientX - finger2.clientX) * (finger1.clientX - finger2.clientX) +
    //     (finger1.clientY - finger2.clientY) * (finger1.clientY - finger2.clientY))
    // }

    // function startTouchListenerIfNeeded() {
    //   if (!_context.state.isPanning) {
    //     _context.state.isPanning = true
    //     document.addEventListener('touchmove', handleTouchMove)
    //     document.addEventListener('touchend', handleTouchEnd)
    //     document.addEventListener('touchcancel', handleTouchEnd)
    //   }
    // }

    // pinchZoomLength = getPinchZoomLength(e.touches[0], e.touches[1])
    // multitouch = true
    // startTouchListenerIfNeeded()
  }
}

function handleTouchMove(e) {
  if (e.touches.length === 1) {
    e.stopPropagation()

    // Start panning
    pan.pan(e.touches[0], _context);
  } else if (e.touches.length === 2) {
    // // it's a zoom, let's find direction
    // multitouch = true
    // var t1 = e.touches[0]
    // var t2 = e.touches[1]

    // // TODO: Add function for pinch zooming
    // // var currentPinchLength = getPinchZoomLength(t1, t2)

    // var scaleMultiplier = 1

    // if (realPinch) {
    //   scaleMultiplier = currentPinchLength / pinchZoomLength
    // } else {
    //   var delta = 0
    //   if (currentPinchLength < pinchZoomLength) {
    //     delta = 1
    //   } else if (currentPinchLength > pinchZoomLength) {
    //     delta = -1
    //   }

    //   scaleMultiplier = getScaleMultiplier(delta)
    // }

    // mouseX = (t1.clientX + t2.clientX) / 2
    // mouseY = (t1.clientY + t2.clientY) / 2

    // publicZoomTo(mouseX, mouseY, scaleMultiplier)

    // pinchZoomLength = currentPinchLength
    // e.stopPropagation()
    // e.preventDefault()
  }
}

function handleTouchEnd(e) {
  if (e.touches.length > 0) {
    var offset = getOffsetXY(e.touches[0])
    mouseX = offset.x
    mouseY = offset.y
  } else {
    // Update the state
    _context.state.isTouching = false;

    // Stop panning
    pan.end(e, _context);

    _releaseTouches()
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