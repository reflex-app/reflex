let initialX
let initialY
let currentX
let currentY
let xOffset = 0
let yOffset = 0

export function start(e, context) {
  // Set the current position of element based on the context
  // just in case something has moved outside of this file
  const matrix = context.transformMatrix

  xOffset = (xOffset !== matrix[4]) ? matrix[4] : xOffset
  yOffset = (yOffset !== matrix[5]) ? matrix[5] : yOffset

  if (e.type === 'touchstart') {
    initialX = e.touches[0].clientX - xOffset
    initialY = e.touches[0].clientY - yOffset

    // Update state to indicate touch
    context.state.isTouching = true
  } else {
    initialX = e.clientX - xOffset
    initialY = e.clientY - yOffset
  }

  // Start kinetic
  // console.log(context);
  // context.kinetic.start();

  // Emit the event
  // TODO: emit an event
  context._emit('panStart', e)

  // Update the state
  context.state.isPanning = true
}

export function pan(e, context) {
  if (context.state.isPanning) {
    // e.preventDefault();

    if (e.type === 'touchmove') {
      currentX = e.touches[0].clientX - initialX
      currentY = e.touches[0].clientY - initialY
    } else {
      currentX = e.clientX - initialX
      currentY = e.clientY - initialY
    }

    xOffset = currentX
    yOffset = currentY

    // Update the matrix
    const matrix = context.transformMatrix

    // Update the x, y indexes
    // [0,1,2,3,4,5]
    //          ^ ^
    matrix[4] = currentX
    matrix[5] = currentY

    // Zoom in by default amount
    context.setTransform(matrix)

    // Start kinetic
    // context.kinetic.activate()
  }
}

export function end(e, context) {
  // Update the initial positions
  initialX = currentX
  initialY = currentY

  if (e.type === 'touchmove') {
    currentX = e.touches[0].clientX - initialX
    currentY = e.touches[0].clientY - initialY

    // Update state to indicate touch
    context.state.isTouching = false
  } else {
    currentX = e.clientX - initialX
    currentY = e.clientY - initialY
  }

  // Emit the event
  // TODO: emit an event
  context._emit('panStop', e)

  // Update state
  context.state.isPanning = false

  // End kinetic
  // context.kinetic.stop()
}

export function panXY(context, event) {
  if (!context.state.isPanning) {
    // Start
    start(event, context)

    // Update the matrix
    const matrix = context.transformMatrix

    // Update the x, y indexes
    // [0,1,2,3,4,5]
    //          ^ ^
    // @TODO: This isn't updating in the parent context — causing flickering
    matrix[4] -= event.deltaX
    matrix[5] -= event.deltaY

    // Update context's matrix
    // This sets the position
    context.setTransform(matrix)

    // End
    end(event, context)
  }
}
