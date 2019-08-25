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
  const matrix = context.transformMatrix // Current transform matrix [0,0,0,0,0,0]
  const currentScale = matrix[0] // Current zoom
  let nextScale // Next zoom
  const transformX = matrix[4]
  const transformY = matrix[5]

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
  // Inspiration
  // https://stackoverflow.com/a/3151987/1114901
  // http://plnkr.co/edit/3aqsWHPLlSXJ9JCcJzgH?p=preview
  // https://www.fortech.ro/how-to-build-a-pan-zoom-plugin-using-the-revealing-module-pattern/
  // https://jsfiddle.net/zez538L8/13/

  const currentPositionX = context.transformMatrix[4]
  const currentPositionY = context.transformMatrix[5]
  const currentScale = context.transformMatrix[0]

  const factor = context.zoomIncrement

  const delta = () => {
    if (event.ctrlKey) {
      // Trackpads
      return event.wheelDelta / (120 * 5)
    } else {
      return event.wheelDelta / 120
    }
  }

  // New Scale
  let newScale = currentScale + delta() * factor
  newScale = zoomProtect(context, newScale) // Make sure within bounds

  // Trigger the zoom
  zoom(newScale, event)

  function zoom(newScale, event) {
    const ratio = 1 - newScale / currentScale

    const {
      clientX,
      clientY
    } = event

    const x = (clientX - currentPositionX) * ratio
    const y = (clientY - currentPositionY) * ratio
    context.setScale(newScale)
    context.setTranslateAdditive(x, y)
  }

  zoomEnd(context, event)
}

/**
 * Prevents zooming past min/max scale
 * Returns a nice number
 * @param  {} scale
 */
function zoomProtect(context, scale) {
  // Prevent min/max scale
  if (scale < context.options.minZoom) {
    return context.options.minZoom
  } else if (scale > context.options.maxZoom) {
    return context.options.maxZoom
  } else {
    return scale
  }
}
