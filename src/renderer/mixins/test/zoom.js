/**
 * Redirects to the correct functions
 * @param {Object} context Should receive the Panzoom Class context
 */
export function zoom(context, event, options) {
  if (!context) throw new Error('No context received')
  options = options || {}

  zoomStart(context, event)

  // Zoom relative to the click/tap x, y
  if (options.relative) {
    if (!event) throw new Error('No event received')
    // If mousewheel
    if (event.deltaY) {
      relZoom(context, event, {
        relative: true
      })
    } else {
      // Else double-tap/click
      relZoom(context, event, {
        relative: true
      })
    }
  } else {
    // Perform a standard zoom
    normalZoom(context, event, options)
  }

  zoomEnd(context, event)
}

/**
 * Zoom in of the parent container
 * @param  {} context Should receive the Panzoom Class context
 */
export function zoomIn(context) {
  normalZoom(context, 'in')
}

/**
 * Zoom out of the parent container
 * @param {Object} context Should receive the Panzoom Class context
 */
export function zoomOut(context) {
  normalZoom(context, 'out')
}

export function zoomStart(context, e) {
  // let element = context.parent; // Cached
  // @TODO: States aren't properly updating

  if (e) {
    switch (e.type) {
      case 'touchstart':
        // Update state to indicate touch
        context.state.isTouching = true
    }
  }

  // if (context.state.isZooming) {
  //   return false;
  // }

  // Emit the event
  // TODO: emit an event
  // context.emit('panzoom:zoomStart');

  // Update the state
  context.state.isZooming = true
}

export function zoomEnd(context, e) {
  // Update the initial positions

  if (e) {
    switch (e.type) {
      case 'touchmove':
        context.state.isTouching = false // Update state to indicate touch
    }
  }

  // Emit the event
  // TODO: emit an event
  // context.emit('panzoom:zoomEnd');

  // Update state
  context.state.isZooming = false
}

function normalZoom(context, args) {
  const matrix = context.transformMatrix // Current transform matrix [0,0,0,0,0,0]
  let currentScale = matrix[0] // Current zoom
  let nextScale // Next zoom
  let transformX = matrix[4]
  let transformY = matrix[5]

  switch (args) {
    case 'in':
      nextScale = currentScale * context.zoomIncrement
      break
    case 'out':
      nextScale = currentScale / context.zoomIncrement
      break
  }

  // Tidy/validate the number
  nextScale = zoomProtect(context, nextScale)

  // Update the scale
  matrix[0] = nextScale
  matrix[3] = nextScale

  let output = [
    nextScale, // scale
    matrix[1], // get existing rotation
    matrix[2], // get existing rotation
    nextScale, // scale
    transformX, // x
    transformY // y
  ]

  // Update the Panzoom internal matrix
  context.setTransform(output)
}

/**
 * Zoom relative to the mouse
 * @param  {Class} context
 * @param  {Event} event
 * @param  {Object} options
 */
function relZoom(context, event, options) {
  const matrix = context.transformMatrix // Current transform matrix [0,0,0,0,0,0]
  let currentScale = matrix[0] // Current zoom
  let nextScale // Next zoom
  let transformX = matrix[4]
  let transformY = matrix[5]

  if (!event || event === 'undefined') return false

  const {
    clientX,
    clientY
  } = event

  // CASE 1: Mouse wheel
  // Move towards mouse position
  if (event.type === 'wheel') {
    let data = {
      delta: event.deltaY / 120,
      factor: currentScale * context.zoomIncrement,
      currentScale: currentScale,
      nextScale: nextScale,
      transformX: transformX,
      transformY: transformY,
      clientX: event.clientX,
      clientY: event.clientY
    }

    if (event.ctrlKey) {
      data.nextScale = currentScale + data.delta * -data.factor
      nextScale = currentScale + data.delta * -data.factor
      moveCanvas(data, 'invert') // Mac Trackpad Pinch-to-zoom
    } else {
      data.nextScale = currentScale + data.delta * data.factor
      nextScale = currentScale + data.delta * data.factor
      // Else: Normal mouseWheel
      switch (event.wheelDelta > 0 || event.detail < 0 ? 'up' : 'down') {
        case 'up':
          moveCanvas(data)
          break
        case 'down':
          moveCanvas(data)
          break
      }
    }
  }

  if (event.type === 'dblclick') {
    // Case 2: Double Click
    let data = {
      delta: event.deltaY / 120,
      factor: currentScale * context.zoomIncrement,
      currentScale: currentScale,
      nextScale: currentScale * context.zoomIncrement,
      transformX: transformX,
      transformY: transformY,
      clientX: event.clientX,
      clientY: event.clientY
    }

    moveCanvas(data)
  }

  // =====
  //
  // Corrections
  //
  nextScale = zoomProtect(context, nextScale)

  // Update the scale
  matrix[0] = nextScale
  matrix[3] = nextScale

  let output = [
    nextScale, // scale
    matrix[1], // get existing rotation
    matrix[2], // get existing rotation
    nextScale, // scale
    transformX, // x
    transformY // y
  ]

  // Update the Panzoom internal matrix
  context.setTransform(output)

  zoomEnd(context, event)
}

/**
 * Prevents zooming past min/max scale
 * Returns a nice number
 * @param  {} scale
 */
function zoomProtect(context, scale) {
  // @TODO: Bug: scale gets stuck here
  // Prevent min/max scale
  if (scale < context.options.minZoom) {
    scale = context.options.minZoom
  } else if (scale > context.options.maxZoom) {
    scale = context.options.maxZoom
  }

  // Prettify the number
  scale = parseFloat(scale.toFixed(10))

  // Return a nice number
  return scale
}

function moveCanvas(data) {
  let {
    currentScale,
    nextScale,
    transformX,
    transformY,
    clientX,
    clientY
  } = data

  const ratio = 1 - nextScale / currentScale

  // Origin: 0, 0
  transformX += (clientX - transformX) * ratio
  transformY += (clientY - transformY) * ratio
}
