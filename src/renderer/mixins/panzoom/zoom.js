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
  //   return false
  // }

  // Emit the event
  // TODO: emit an event
  context._emit('zoomStart', e)

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
  context._emit('zoomStop', e)

  // Update state
  context.state.isZooming = false
}

function normalZoom(context, args) {
  const matrix = context.getTransforms() // Current transform matrix [0,0,0,0,0,0]
  const currentScale = matrix.scale // Current zoom
  let nextScale // Next zoom

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

  const output = [
    nextScale, // scale
    0, // get existing rotation
    0, // get existing rotation
    nextScale, // scale
    matrix.x, // x
    matrix.y // y
  ]

  // NEW API
  context.update({
    scale: nextScale
  })
}

/**
 * Zoom relative to the mouse
 * @param  {Class} context
 * @param  {Event} event
 * @param  {Object} options
 */
function relZoom(context, event, options) {
  // via: https://jsfiddle.net/f9kctwby/
  const currentTransforms = context.getTransforms()
  const target = context.element
  let zoom_point = { x: 0, y: 0 } // Starting point
  let zoom_target = { x: 0, y: 0 } // The target point
  let pos = { x: 0, y: 0 }
  let size = { w: target.offsetWidth, h: target.offsetHeight }
  let scale = currentTransforms.scale
  const factor = 0.5 // The amount to zoom by

  // Init
  init(event)

  function init(e) {
    // via: https://stackoverflow.com/a/11396681/1114901
    e.preventDefault();

    //
    // Set the point to zoom to based on cursor position
    // NOTE: These values don't contain "px"
    //
    const parentOffset = context.parent.getBoundingClientRect()
    const childOffset = context.element.getBoundingClientRect()

    zoom_point.x = e.pageX - (parentOffset.left - childOffset.left)
    zoom_point.y = e.pageY - (parentOffset.top - childOffset.left)

    //
    // Set the delta
    //
    let delta = e.delta || e.wheelDelta;
    if (delta === undefined) {
      //we are on firefox
      delta = e.detail;
    }
    delta = Math.max(-1, Math.min(1, delta)) // cap the delta to [-1,1] for cross browser consistency

    // determine the point on where the slide is zoomed in
    zoom_target.x = (zoom_point.x - pos.x) / scale
    zoom_target.y = (zoom_point.y - pos.y) / scale

    // apply zoom
    scale += delta * factor * scale
    scale = Math.max(1, Math.min(context.options.maxZoom, scale)) // Maximum scale

    // calculate x and y based on zoom
    pos.x = -zoom_target.x * scale + zoom_point.x
    pos.y = -zoom_target.y * scale + zoom_point.y

    // Make sure the slide stays in its container area when zooming out
    if (pos.x > 0)
      pos.x = 0
    if (pos.x + size.w * scale < size.w)
      pos.x = -size.w * (scale - 1)
    if (pos.y > 0)
      pos.y = 0
    if (pos.y + size.h * scale < size.h)
      pos.y = -size.h * (scale - 1)

    update()
  }

  function update() {
    const x = pos.x + size.w * (scale - 1) / 2
    const y = pos.y + size.h * (scale - 1) / 2

    // NEW API
    context.update({
      x: x,
      y: y,
      scale: scale
    })

    zoomEnd(context, event)
  }

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
