// The CSS classes

import Panzoom, { PanzoomObject } from '@panzoom/panzoom'

// TODO: Add tests to make sure these don't break
const panzoomContainer = '.panzoom-container'
const panzoomChild = '.panzoom-inner'
const zoomPadding = 0.25
export const minScale = 0.001

function getPanzoomElement(name: 'viewport' | 'container') {
  const viewport = document.querySelector(panzoomContainer) as HTMLElement
  if (!viewport) {
    console.error('No container')
    return {}
  }
  // Calculate the position of the element relative to the viewport container
  const viewportRect = viewport.getBoundingClientRect()

  // Get the full size of the artboards container (panzoomChild)
  const container = document.querySelector(panzoomChild) as HTMLElement
  if (!container) return {}
  const containerRect = container.getBoundingClientRect()

  let element: HTMLElement
  let elementRect: DOMRect

  if (name === 'container') {
    element = container
    elementRect = containerRect
  } else {
    element = viewport
    elementRect = viewportRect
  }

  // Always return an HTML Element and a bounding rectangle
  return {
    el: element,
    rect: elementRect,
  }
}

/**
 * Returns the x, y, zoom for the initial app startup
 */
export function initialPanZoom() {
  // Calculate the zoom to fit all artboards
  const zoom = calculateZoomToFitAll()

  // Pan
  // Old calculation: https://github.com/reflex-app/reflex/blob/42b07e33cbed8404d60749c29f0ed5f04a412184/app/src/renderer/components/panzoom/panzoomFns.ts#L23
  const { x: panX, y: panY } = getViewportCenterCoordinates(zoom)

  // center child element within viewport
  return {
    x: panX,
    y: panY,
    zoom: zoom,
  }
}

/**
 * Programmatically centers an element in the viewport
 */
export function centerOnElement(
  element: HTMLElement,
  options: { instance: any }
) {
  // Get the position and dimensions of the element relative to the viewport.
  // Then you can calculate the center point of the element by adding half of the width and height to its top-left position
  // Then subtract the position of the parent element to get the center relative to its parent.

  const { el: parent, rect: parentRect } = getPanzoomElement('viewport')
  if (!parent) {
    console.error('No container')
    return {}
  }
  // Calculate the position of the element relative to the parent container

  // Get the full size of the artboards container (panzoomChild)
  const { el: container, rect: containerRect } = getPanzoomElement('container')
  if (!container) return false

  // Get the element's bounding rectangle relative to the viewport
  const child = element
  const childRect = child.getBoundingClientRect()

  // console.log('Test', {
  //   parent: parent,
  //   container: container,
  //   child: child,
  // })

  // Current settings
  // TODO: Get the current zoom level
  // const zoom = options.instance.getScale()
  const zoom = getZoomToFitElement(child)
  console.log('Zoom', zoom)
  if (!zoom) return false

  // Get the viewport dimensions in pixels
  const viewportWidth = parent.offsetWidth
  const viewportHeight = parent.offsetHeight

  const containerOffsetLeft = child.offsetLeft * zoom
  const containerOffsetTop = child.offsetTop * zoom
  console.log('offset', containerOffsetLeft, containerOffsetTop)

  console.log('viewportWidth:', viewportWidth)
  console.log('viewportHeight:', viewportHeight)
  console.log('containerOffsetLeft:', containerOffsetLeft)
  console.log('containerOffsetTop:', containerOffsetTop)

  // Calculate the center point of the viewport, adjusted for the container offset
  // Factor in the zoom level
  const viewportCenterX = (viewportWidth / 2 - containerOffsetLeft) / zoom
  const viewportCenterY = (viewportHeight / 2 - containerOffsetTop) / zoom

  console.log('viewportCenterX:', viewportCenterX)
  console.log('viewportCenterY:', viewportCenterY)

  // Set the position of the element to the adjusted center point of the viewport
  const elementWidth = child.offsetWidth
  const elementHeight = child.offsetHeight

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
  // This works... but it would be better to use pan() and zoom()
  // options.instance.setStyle(
  //   'transform',
  //   `scale(${zoom}) translate(${x}px, ${y}px)`
  // )

  // Perform the panning & zoom
  options.instance.pan(x, y)
  options.instance.zoom(zoom)
}

/**
 * This will get coordinates to place the container at the top-left of the viewport
 */
export function getCoordinatesTopLeft(
  zoom: number,
  options?: { instance: PanzoomObject }
) {
  let scale

  // Set zoom
  scale = zoom ? zoom : options?.instance.getScale()

  console.log('scale', scale)

  const { el: viewport, rect: viewportRect } = getPanzoomElement('viewport')
  const { el: container, rect: containerRect } = getPanzoomElement('container')

  if (!viewport || !container) return {}

  // Get the viewport dimensions in pixels
  const viewportWidth = viewport.offsetWidth
  const viewportHeight = viewport.offsetHeight
  console.log(viewportHeight, viewportWidth)

  // Get the offset from the container element
  const containerOffsetLeft = container.offsetLeft * scale
  const containerOffsetTop = container.offsetTop * scale

  // Calculate the center point of the viewport, adjusted for the container offset
  // Factor in the zoom level
  const viewportCenterX = viewportWidth / 2 - containerOffsetLeft
  const viewportCenterY = viewportHeight / 2 - containerOffsetTop

  // Final position
  const containerWidth = Math.min(container.offsetWidth, viewportWidth)
  const containerHeight = Math.min(container.offsetHeight, viewportHeight)
  const x = viewportCenterX - containerWidth / 2
  const y = viewportCenterY - containerHeight / 2

  const offsetX = (viewportWidth - containerWidth) / 2
  const offsetY = (viewportHeight - containerHeight) / 2

  const finalX = x + offsetX
  const finalY = y + offsetY

  console.log('x:', x)
  console.log('y:', y)

  return { x: finalX, y: finalY }
}

/**
 * Get the XY coordinates at the center of the viewport(container)
 * Useful for centering all artboards in the viewport
 */
export function getViewportCenterCoordinates(
  zoom: number,
  options?: { instance: PanzoomObject }
) {
  let scale

  // Set zoom
  scale = zoom ? zoom : options?.instance.getScale()

  const { el: viewport } = getPanzoomElement('viewport')
  const { el: container } = getPanzoomElement('container')

  if (!viewport || !container) return {}

  // Get the viewport dimensions in pixels
  const viewportWidth = viewport.offsetWidth
  const viewportHeight = viewport.offsetHeight

  // Get the offset from the container element
  const containerOffsetLeft = container.offsetLeft * scale
  const containerOffsetTop = container.offsetTop * scale

  // Calculate the center point of the viewport, adjusted for the container offset
  const viewportCenterX = (viewportWidth / 2 + containerOffsetLeft) / scale
  const viewportCenterY = (viewportHeight / 2 + containerOffsetTop) / scale

  // Calculate the container dimensions, scaled to the current zoom level
  // NOTE: We don't need to calculate scale here
  const containerWidth = container.offsetWidth
  const containerHeight = container.offsetHeight

  // Calculate the position of the container to be centered on the viewport center point
  const x = viewportCenterX - containerWidth / 2
  const y = viewportCenterY - containerHeight / 2

  return { x: x, y: y }
}

/**
 * Returns the X, Y coordinates of an element
 * relative to the inner Panzoom container.
 * Can use these coordinates with panzoom.pan()
 */
function getElementCoordinates(e: HTMLElement, zoom: number, options) {
  let scale

  // Set zoom
  scale = zoom ? zoom : options?.instance.getScale()

  console.log('scale', scale)

  const { el: viewport, rect: viewportRect } = getPanzoomElement('viewport')
  const { el: container, rect: containerRect } = getPanzoomElement('container')
  const child = e

  if (!viewport || !container) {
    console.error('No parent or container element found')
    return { x: 0, y: 0 }
  }

  const containerOffsetLeft = containerRect.left - viewport.offsetLeft
  const containerOffsetTop = containerRect.top - viewport.offsetTop

  // Calculate the center coordinates of the "container" element, accounting for the zoom/scale factor
  const containerCenterX =
    (containerOffsetLeft + container.offsetWidth / 2) * scale
  const containerCenterY =
    (containerOffsetTop + container.offsetHeight / 2) * scale

  // Calculate the center coordinates of the "child" element relative to the "container" element, accounting for the zoom/scale factor
  const childCenterX = (child.offsetWidth / 2) * scale
  const childCenterY = (child.offsetHeight / 2) * scale

  // Calculate the final center coordinates of the "child" element, accounting for the relative positioning and zoom/scale factor
  const finalCenterX = containerCenterX + childCenterX
  const finalCenterY = containerCenterY + childCenterY

  return {
    x: finalCenterX,
    y: finalCenterY,
  }
}

/**
 * Returns the zoom scale needed to fit a specific element (e.g. an <Artboard>) in the viewport
 */
function getZoomToFitElement(e: HTMLElement) {
  const { el: viewport } = getPanzoomElement('viewport')
  if (!viewport) {
    console.error('No container')
    return 1
  }

  const { el: container, rect: containerRect } = getPanzoomElement('container')
  if (!container) {
    console.error('No container')
    return 1
  }

  const child = e

  // Calculate the zoom scale based on the longer side of the child element
  const widthRatio =
    viewport.offsetWidth / (child.offsetWidth + child.offsetWidth * zoomPadding)
  const heightRatio =
    viewport.offsetHeight /
    (child.offsetHeight + child.offsetHeight * zoomPadding)

  // If the child height is greater than the viewport height, calculate the zoom scale based on the child height
  const maxHeightRatio =
    viewport.offsetHeight /
    (child.offsetHeight +
      child.offsetHeight *
        zoomPadding *
        (viewport.offsetWidth / child.offsetWidth))
  const aspectRatio = child.offsetWidth / child.offsetHeight
  const maxAdjustedHeightRatio =
    viewport.offsetHeight /
    (child.offsetHeight +
      (child.offsetHeight *
        zoomPadding *
        Math.sqrt(viewport.offsetWidth / child.offsetWidth)) /
        aspectRatio)

  // Adjust the zoom ratio based on the aspect ratio of the child element
  const zoom = Math.min(
    widthRatio,
    heightRatio,
    maxHeightRatio / aspectRatio,
    maxAdjustedHeightRatio
  )

  // Return
  return zoom
}

/**
 * Returns a zoom factor which would fit all the current artboards within the viewport
 */
export function calculateZoomToFitAll(): number {
  const { el: viewport } = getPanzoomElement('viewport')
  if (!viewport) {
    console.error('No container')
    return 1
  }

  const { el: container, rect: containerRect } = getPanzoomElement('container')
  if (!container) {
    console.error('No container')
    return 1
  }

  // Calculate the zoom scale based on the longer side of the child element
  const widthRatio =
    viewport.offsetWidth /
    (container.offsetWidth + container.offsetWidth * zoomPadding)
  const heightRatio =
    viewport.offsetHeight /
    (container.offsetHeight + container.offsetHeight * zoomPadding)

  // If the container height is greater than the viewport height, calculate the zoom scale based on the container height
  const maxHeightRatio =
    viewport.offsetHeight /
    (container.offsetHeight +
      container.offsetHeight *
        zoomPadding *
        (viewport.offsetWidth / container.offsetWidth))
  const aspectRatio = container.offsetWidth / container.offsetHeight
  const maxAdjustedHeightRatio =
    viewport.offsetHeight /
    (container.offsetHeight +
      (container.offsetHeight *
        zoomPadding *
        Math.sqrt(viewport.offsetWidth / container.offsetWidth)) /
        aspectRatio)

  // Adjust the zoom ratio based on the aspect ratio of the container element
  const zoom = Math.min(
    widthRatio,
    heightRatio,
    maxHeightRatio / aspectRatio,
    maxAdjustedHeightRatio
  )
  return zoom
}
