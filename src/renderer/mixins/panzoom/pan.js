let initialX

let initialY

let currentX

let currentY

let xOffset = 0

let yOffset = 0

export function start(e, context) {
  // Set the current position of element based on the context
  // just in case something has moved outside of this file
  const matrix = context.getTransform()

  xOffset = (xOffset !== matrix.x) ? matrix.x : xOffset
  yOffset = (yOffset !== matrix.y) ? matrix.y : yOffset

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
    const matrix = context.getTransform()

    // Update the x, y indexes
    // [0,1,2,3,4,5]
    //          ^ ^
    matrix.x = currentX
    matrix.y = currentY

    // NEW API 
    context.update({
      x: matrix.x,
      y: matrix.y
    })

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
    const matrix = context.getTransform()

    // Update the x, y indexes
    // [0,1,2,3,4,5]
    //          ^ ^
    // @TODO: This isn't updating in the parent context — causing flickering
    matrix.x -= event.deltaX
    matrix.y -= event.deltaY

    // NEW API
    context.update({
      x: matrix.x,
      y: matrix.y
    })

    // End
    end(event, context)
  }
}

export function panToElement(el) {
  const context = document.$panzoom // The global Panzoom context
  if (!context.state.isPanning) {
    // Start
    // start(event, context)

    // DOM element references
    const parent = context.parent // This is the total available height & width
    const container = context.element // This is the total available height & width
    const element = el // This is the element we want to center on
    let matrix = context.getTransform()

    /**
     * We need to move our translate() coordinates
     * so that the element's center point aligns
     * with the parent container's center point.
     * And then set the scale so that we can see
     * the element in the viewport.
     *
     * NOTE: All of this relies on the current scale
     * applied to the element that has the
     * CSS tranform on it (context.parent)
     *
     * NOTE: We're working with CSS transforms
     * with the assumption that the x and y
     * center is 0, 0 (transform-origin 50% 50%)
     *
     * We can do so by getting the current width of the
     * parent element (considering current scale).
     *
     * We calculate the child element's placement by
     * first getting the distance from the left of the
     * parent container. This is the amount it will need
     * to travel to line up with our X axis.
     *
     * Then we add on the width of the element itself.
     *
     * As well as the computed margin of the element.
     *
     * Then we subtract the two middlepoints, and that
     * value becomes the new X coordinate.
     */

    /**
     * Get the scale
     * This is required
     */
    const scale = matrix.scale

    /**
     * The parent center point
     */
    const viewportCenterX = (parent.offsetWidth / 2) * scale
    const viewportCenterY = (parent.offsetHeight / 2) * scale

    /**
     * The width of the element's container
     */
    const containerWidth = (container.offsetWidth / 2) * scale
    const containerHeight = (container.offsetHeight / 2) * scale

    /**
     * The element center point
     */
    const offsetLeft = element.offsetLeft
    const offsetTop = element.offsetTop

    const width = element.offsetWidth / 2
    const height = element.offsetHeight / 2

    const elementCenterX = (offsetLeft + width) * scale
    const elementCenterY = (offsetTop + height) * scale

    /**
     * We've now calculated our two center points
     * and can subtract to calculate the new
     * X-axis position
     *
     * We'll get the difference between the viewport and the container,
     * and then move to our artboard
     */

    // This part is pure magic
    matrix.x = ((viewportCenterX - containerWidth) - (viewportCenterX - elementCenterX)) * -1
    matrix.y = ((viewportCenterY - containerHeight) - (viewportCenterY - elementCenterY)) * -1

    // NEW API
    context.update({
      x: matrix.x,
      y: matrix.y
    })

    // Scale to fit the screen
    context.scaleToFit()

    // End
    // end(event, context)
  }
}
