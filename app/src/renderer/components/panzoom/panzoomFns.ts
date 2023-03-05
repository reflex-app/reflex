// The CSS classes
// TODO: Add tests to make sure these don't break
const panzoomContainer = '.panzoom-container'
const panzoomChild = '.panzoom-inner'

/**
 * Returns the x, y, zoom for the initial app startup
 */
export function initialPanZoom() {
  const panzoomEl = document.querySelector<HTMLElement>(panzoomContainer)
  if (!panzoomEl) {
    console.error('No container')
    return {}
  }
  const childElement = panzoomEl?.querySelector(panzoomChild) as HTMLElement

  const panzoomRect = panzoomEl.getBoundingClientRect()
  const childRect = childElement.getBoundingClientRect()

  // Calculate the zoom to fit all artboards
  const zoom = calculateZoomToFitAll()

  // Pan
  const panX = (panzoomRect.width - childRect.width) / 2 - childRect.left
  const panY = (panzoomRect.height - childRect.height) / 2 - childRect.top

  // center child element within viewport
  return {
    x: panX,
    y: panY,
    zoom: zoom,
  }
}
export function centerOn(element: HTMLElement, options: { instance: any }) {
  // Get the position and dimensions of the element relative to the viewport.
  // Then you can calculate the center point of the element by adding half of the width and height to its top-left position
  // Then subtract the position of the parent element to get the center relative to its parent.
  // const parent = document.querySelector<HTMLElement>(panzoomContainer)
  const parent = document.querySelector<HTMLElement>(panzoomContainer)
  // const parent = document.documentElement
  if (!parent) {
    console.error('No container')
    return {}
  }
  // Calculate the position of the element relative to the parent container
  const parentRect = parent.getBoundingClientRect()

  // Get the full size of the artboards container (panzoomChild)
  const container = element.closest(panzoomChild) as HTMLElement
  if (!container) return false
  const containerRect = container.getBoundingClientRect()

  // Get the element's bounding rectangle relative to the viewport
  const child = element
  const childRect = child.getBoundingClientRect()

  /////////////

  // Calculate the center point of the element

  // const containerCenterX = containerRect.left + containerRect.width / 2
  // const containerCenterY = containerRect.top + containerRect.height / 2
  // const childCenterX = childRect.left + childRect.width / 2
  // const childCenterY = childRect.top + childRect.height / 2
  // const dx = containerCenterX - childCenterX
  // const dy = containerCenterY - childCenterY
  // const distance = Math.sqrt(dx * dx + dy * dy)
  // const intensity = Math.min(1, distance / (containerRect.width / 2))
  // const factorX = dx * intensity * (childRect.width / containerRect.width)
  // const factorY = dy * intensity * (childRect.height / containerRect.height)
  // const centerX =
  //   (parentRect.width - childRect.width) / 2 +
  //   containerRect.left -
  //   childRect.left +
  //   factorX
  // const centerY =
  //   (parentRect.height - childRect.height) / 2 +
  //   containerRect.top -
  //   childRect.top +
  //   factorY

  // console.log('Distance', distance)

  ///////////////
  // const containerWidth = container.clientWidth
  // const containerHeight = container.clientHeight
  // const centerX =
  //   (parentRect.width - containerRect.width + childRect.width) / 2 -
  //   childRect.left
  // const centerY =
  //   (parentRect.height - containerRect.height + childRect.height) / 2 -
  //   childRect.top

  // console.log('centerX:', centerX)
  // console.log('centerY:', centerY)
  ////////////

  // const centerX = (parentRect.width - childRect.width) / 2 - childRect.left
  // const centerY = (parentRect.height - childRect.height) / 2 - childRect.top

  // Calculate the zoom scale
  // const panzoomViewportRect = {
  //   width: parent.offsetWidth,
  //   height: parent.offsetHeight,
  // }
  // const zoom = zoomToFitElement(element)
  // const zoom = options.instance.getScale()
  // if (!zoom) return false

  // TODO: Include window.devicePixelRatio?

  // var viewportWidth = parentRect.width
  // var viewportHeight = parentRect.height
  // var childWidth = childRect.width * zoom // We want to use the rendered width
  // var childHeight = childRect.height * zoom // We want to use the rendered height
  // var childX = (childRect.left - parentRect.left) / zoom
  // var childY = (childRect.top - parentRect.top) / zoom
  // var minX = Math.max(0, childWidth / 2 - parentRect.width / 2 - childX)
  // var minY = Math.max(0, childHeight / 2 - parentRect.height / 2 - childY)
  // var centerX = parentRect.width / 2 - childWidth / 2 + minX
  // var centerY = parentRect.height / 2 - childHeight / 2 + minY

  // const centerX = parentRect.left + parentRect.width / 2
  // const centerY = parentRect.top + parentRect.height / 2

  // const offsetX =
  //   centerX -
  //   (childRect.left + childRect.width / 2) -
  //   (childRect.width - parentRect.width) / 2
  // const offsetY =
  //   centerY -
  //   (childRect.top + childRect.height / 2) -
  //   (childRect.height - parentRect.height) / 2

  // // const centerXOnScreen = window.innerWidth / 2 - parentRect.left - parentRect.width / 2 + offsetX;
  // // const centerYOnScreen = window.innerHeight / 2 - parentRect.top - parentRect.height / 2 + offsetY;

  // console.log(parent, element.closest(panzoomChild), element) // Elements
  // console.log(zoom, centerX, centerY, { child, container }) // Output
  // options.instance.pan(offsetX, offsetY)

  ////////////////////////////////

  console.log('Test', {
    parent: parent,
    container: container,
    child: child,
  })

  // Current settings
  const zoom = options.instance.getScale()
  if (!zoom) return false

  // Get the viewport dimensions in pixels
  const viewportWidth = parent.offsetWidth
  const viewportHeight = parent.offsetHeight
  // const viewportWidth = parentRect.width
  // const viewportHeight = parentRect.height

  // Get the offset from the container element
  // const containerOffsetLeft = childRect.left
  // const containerOffsetTop = childRect.top
  const containerOffsetLeft = child.offsetLeft * zoom
  const containerOffsetTop = child.offsetTop * zoom
  console.log('offset', containerOffsetLeft, containerOffsetTop)

  console.log('viewportWidth:', viewportWidth)
  console.log('viewportHeight:', viewportHeight)
  console.log('containerOffsetLeft:', containerOffsetLeft)
  console.log('containerOffsetTop:', containerOffsetTop)

  // Calculate the center point of the viewport, adjusted for the container offset
  // Factor in the zoom level
  // const viewportCenterX = viewportWidth / 2 - containerOffsetLeft
  // const viewportCenterY = viewportHeight / 2 - containerOffsetTop
  const viewportCenterX = (viewportWidth / 2 - containerOffsetLeft) / zoom
  const viewportCenterY = (viewportHeight / 2 - containerOffsetTop) / zoom

  console.log('viewportCenterX:', viewportCenterX)
  console.log('viewportCenterY:', viewportCenterY)

  // Set the position of the element to the adjusted center point of the viewport
  // const elementWidth = childRect.width
  // const elementHeight = childRect.height
  const elementWidth = child.offsetWidth
  const elementHeight = child.offsetHeight
  // const elementWidth = parseFloat(getComputedStyle(element).width)
  // const elementHeight = parseFloat(getComputedStyle(element).height)

  console.log('elementWidth:', elementWidth)
  console.log('elementHeight:', elementHeight)

  // Final position
  const x = viewportCenterX - elementWidth / 2
  const y = viewportCenterY - elementHeight / 2

  console.log('x:', x)
  console.log('y:', y)

  // Normally, we pan relative to the container
  // But we want to pan relative to a specific element, so we can
  // set our own transform values to be more specific
  // options.instance.setTransform()
  options.instance.setStyle(
    'transform',
    `scale(${zoom}) translate(${x}px, ${y}px)`
  )
  console.log()

  // options.instance.pan(x, y)
  ////////////////////////////////

  // options.instance.zoom(zoom)

  // Firstly calculate the offset of the element relative to the parent
  // The first artboard is always 0,0
  // NOTE: other elements are always negative, because the elements are on the right. Positive values are on the left.
  // Then, subtract the width and height of the element (including padding, border, and margin)
  // NOTE: Use .getBoundingClientRect() to because it returns the rendered size of the element (incl. CSS transforms)
  // Use .offsetLeft/offsetTop to get position which Panzoom uses
  // Finally, we get the difference of the parent and container width/height

  // const elWidth = child.offsetWidth / 2
  // const elHeight = child.offsetHeight / 2
  // // const elWidth = childRect.width / 2
  // // const elHeight = childRect.height / 2
  // console.log(elWidth)

  // const arbitraryX =

  // // const parentDiff = container.offsetLeft - parent.offsetLeft
  // const parentDiff = containerRect.left - parentRect.left
  // // const parentDiff = containerRect.left
  // // const parentDiff = containerRect.left
  // console.log(parentDiff)

  // let negativeX, negativeY
  // child.offsetLeft === 0 ? (negativeX = false) : (negativeX = true)
  // child.offsetTop === 0 ? (negativeY = false) : (negativeY = true)

  // let newX, newY
  // newX = child.offsetLeft + elWidth
  // newY = child.offsetTop - elHeight

  // if (negativeX) {
  //   console.log('Negative X')
  //   newX = -newX
  // }
  // if (negativeY) {
  //   console.log('Negative Y')
  //   newX = -newY
  // }

  // console.log(newX, newY, { element, container, parent })
  // options.instance.pan(newX, newY)
  // options.instance.pan(newX, newY)
  // setTimeout(() => options.instance.zoom(zoom))

  // options.instance.zoom(zoom)

  // options.instance.zoomToPoint(zoom, {
  //   clientX: centerX,
  //   clientY: centerY,
  // })

  // const panzoomEl = document.querySelector<HTMLElement>(panzoomContainer)
  // if (!panzoomEl) {
  //   console.error('No container')
  //   return {}
  // }
  // // const childElement = panzoomEl?.querySelector(panzoomChild) as HTMLElement
  // const childElement = element.closest(panzoomChild) as HTMLElement
  // console.log(childElement)

  // const panzoomRect = panzoomEl.getBoundingClientRect()
  // const childRect = childElement.getBoundingClientRect()

  // const panzoomViewportRect = {
  //   width: panzoomEl.offsetWidth,
  //   height: panzoomEl.offsetHeight,
  // }
  // const childWidth = childRect.width
  // const childHeight = childRect.height

  // // Calculate the zoom scale
  // const zoomPadding = 0.9 // add extra space on sides of the content
  // const zoomX = (panzoomViewportRect.width / childWidth) * zoomPadding
  // const zoomY = (panzoomViewportRect.height / childHeight) * zoomPadding
  // const zoom = Math.min(zoomX, zoomY)

  // // Pan
  // const panX = (panzoomRect.width - childRect.width) / 2 - childRect.left
  // const panY = (panzoomRect.height - childRect.height) / 2 - childRect.top

  // // center child element within viewport
  // options.instance.pan(panX, panY)
  // options.instance.zoom(zoom)
}
/**
 * Returns a zoom factor which would fit all the current artboards within the viewport
 */
export function calculateZoomToFitAll(): number {
  const panzoomEl = document.querySelector<HTMLElement>(panzoomContainer)
  if (!panzoomEl) {
    console.error('No container')
    return 1
  }
  const childElement = panzoomEl?.querySelector(panzoomChild) as HTMLElement

  const panzoomViewportRect = {
    width: panzoomEl.offsetWidth,
    height: panzoomEl.offsetHeight,
  }
  const childRect = childElement.getBoundingClientRect()
  const childWidth = childRect.width
  const childHeight = childRect.height

  // Calculate the zoom scale
  const zoomPadding = 0.9 // add extra space on sides of the content
  const zoomX = (panzoomViewportRect.width / childWidth) * zoomPadding
  const zoomY = (panzoomViewportRect.height / childHeight) * zoomPadding
  const zoom = Math.min(zoomX, zoomY)

  // Return
  return zoom
}

