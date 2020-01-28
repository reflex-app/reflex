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
  const matrix = context.getTransform() // Current transform matrix [0,0,0,0,0,0]
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

  context.update({
    scale: nextScale
  })
}


/**
 * Zoom relative to the mouse
 * This gets called upon every singe scroll event
 * @param  {Class} context
 * @param  {Event} event
 * @param  {Object} options
 */
function relZoom(context, e) {
  // via: https://stackoverflow.com/a/46833254/1114901
  // via: https://jsfiddle.net/f9kctwby/

  const size = { w: context.element.offsetWidth, h: context.element.offsetHeight }
  const factor = context.zoomIncrement // The amount to zoom by

  const parentOffset = context.parent.getBoundingClientRect()
  const childOffset = context.element.getBoundingClientRect()
  let elPosition = {
    x: childOffset.left - parentOffset.left, // Remove any app chrome 
    y: childOffset.top - parentOffset.top // Remove any app chrome
  }

  const currentTransforms = context.getTransform()
  let scale = currentTransforms.scale

  // Init
  // via: https://stackoverflow.com/a/11396681/1114901
  e.preventDefault();
  e.stopPropagation();

  //
  // Set the delta to decide direction in/out 
  // 1 or -1
  //
  let delta = e.delta || e.wheelDelta;
  if (delta === undefined) delta = e.detail; // Firefox
  delta = Math.max(-1, Math.min(1, delta)) // cap the delta to [-1,1] for cross browser consistency

  //
  // Set the point to zoom to based on cursor position
  // NOTE: This is a raw input value, doesn't take into account the current
  // scale or other factors
  //
  // const parentOffset = context.parent.getBoundingClientRect()
  let mouse_point = {
    x: e.pageX - parentOffset.left, // Remove any app chromes
    y: e.pageY - parentOffset.top // Remove any app chrome
  }
  // let mouse_point
  // if (delta == 1) {
  //   mouse_point = {
  //     x: e.pageX + parentOffset.left,
  //     y: e.pageY + parentOffset.top
  //   }
  // } else if (delta == -1) {
  //   mouse_point = {
  //     x: e.pageX - parentOffset.left,
  //     y: e.pageY - parentOffset.top
  //   }
  // }

  // determine the point where to zoom in
  let zoom_target = {
    x: (mouse_point.x - elPosition.x) / scale,
    y: (mouse_point.y - elPosition.y) / scale
  }

  // apply zoom
  scale += delta * factor * scale
  scale = Math.max(context.options.minZoom, Math.min(context.options.maxZoom, scale)) // Maximum scale
  // TODO Handle touchpads and inverted direction zoom
  // if (event.ctrlKey) {
  //   // Inverted scrolling
  //   scale -= delta * factor * scale
  //   scale = Math.max(1, Math.min(context.options.maxZoom, scale)) // Maximum scale
  // } else {
  //   // Normal scroll wheel
  //   scale += delta * factor * scale
  //   scale = Math.max(1, Math.min(context.options.maxZoom, scale)) // Maximum scale
  // }

  // Update x and y based on zoom
  elPosition.x = -zoom_target.x * scale + mouse_point.x
  elPosition.y = -zoom_target.y * scale + mouse_point.y

  // Make sure the slide stays in its container area when zooming out
  // if (elPosition.x > 0)
  //   elPosition.x = 0
  // if (elPosition.x + size.w * scale < size.w)
  //   elPosition.x = -size.w * (scale - 1)
  // if (elPosition.y > 0)
  //   elPosition.y = 0
  // if (elPosition.y + size.h * scale < size.h)
  //   elPosition.y = -size.h * (scale - 1)

  // Update
  // Adjsut for the `transform-origin: center`

  // Don't move the canvas if we're at min/max zoom 
  if (scale <= context.options.minZoom || scale >= context.options.maxZoom) return false

  context.update({
    x: elPosition.x + size.w * (scale - 1) / 2,
    y: elPosition.y + size.h * (scale - 1) / 2,
    scale: scale
  })


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