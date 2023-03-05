// The CSS classes

import Panzoom, { PanzoomObject } from '@panzoom/panzoom'

// TODO: Add tests to make sure these don't break
const panzoomContainer = '.panzoom-container'
const panzoomChild = '.panzoom-inner'

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
  const { el: parent } = getPanzoomElement('viewport')
  const childElement = parent?.querySelector(panzoomChild) as HTMLElement

  // Calculate the zoom to fit all artboards
  const zoom = calculateZoomToFitAll()

  // Pan
  const { x: panX, y: panY } = getCenterCoordinates(childElement, zoom)

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

  // console.log('Test', {
  //   parent: parent,
  //   container: container,
  //   child: child,
  // })

  // Current settings
  // TODO: Get the current zoom level
  const zoom = options.instance.getScale()
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

  options.instance.zoom(zoom)
  setTimeout(() =>
    options.instance.setStyle(
      'transform',
      `scale(${zoom}) translate(${x}px, ${y}px)`
    )
  )

  // options.instance.pan(x, y)
  ////////////////////////////////

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
 * Get the XY coordinates of the center of the viewport
 */
export function getCenterCoordinates(
  element: HTMLElement,
  zoom: number,
  options?: { instance: PanzoomObject }
) {
  let scale

  // Set zoom
  scale = zoom ? zoom : options?.instance.getScale()

  console.log('scale', scale)

  const { el: parent, rect: parentRect } = getPanzoomElement('viewport')
  const { el: container, rect: containerRect } = getPanzoomElement('container')
  const child = element

  // Get the viewport dimensions in pixels
  const viewportWidth = parent.offsetWidth
  const viewportHeight = parent.offsetHeight
  console.log(viewportHeight, viewportWidth)

  // Get the offset from the container element
  const containerOffsetLeft = child.offsetLeft * scale
  const containerOffsetTop = child.offsetTop * scale
  console.log('offset', containerOffsetLeft, containerOffsetTop)

  console.log('viewportWidth:', viewportWidth)
  console.log('viewportHeight:', viewportHeight)
  console.log('containerOffsetLeft:', containerOffsetLeft)
  console.log('containerOffsetTop:', containerOffsetTop)

  // Calculate the center point of the viewport, adjusted for the container offset
  // Factor in the zoom level
  const viewportCenterX = (viewportWidth / 2 - containerOffsetLeft) / scale
  const viewportCenterY = (viewportHeight / 2 - containerOffsetTop) / scale

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

  return { x, y }
}

/**
 * Returns the X, Y coordinates of an element
 * relative to the inner Panzoom container.
 * Can use these coordinates with panzoom.pan()
 */
function getElementCoordinates(e: HTMLElement, zoom: number) {
  // The Panzoom viewport node
  // The Panzoom content container node
  // Some specific element node _within_ the Panzoon content container

  // 1. Calculate the center of the viewport element and the container element
  // 2. Calculate the offset of a specific element relative to the container element
  // 3. Calculate final x,y coordinates which will put the specific element in the center of the viewport
  // given that center is calculated relative to the container element

  const viewport = document.querySelector<HTMLElement>(panzoomContainer)
  const container = document.querySelector(panzoomChild) as HTMLElement
  const element = e

  const viewportCenterX = viewport.clientWidth / 2 + viewport.scrollLeft
  const viewportCenterY = viewport.clientHeight / 2 + viewport.scrollTop

  const containerRect = container.getBoundingClientRect()
  const containerCenterX = containerRect.left + containerRect.width / 2
  const containerCenterY = containerRect.top + containerRect.height / 2

  const elementRect = element.getBoundingClientRect()

  const elementOffsetX = elementRect.left - containerRect.left
  const elementOffsetY = elementRect.top - containerRect.top

  const finalX = viewportCenterX - (elementOffsetX + elementRect.width / 2)
  const finalY = viewportCenterY - (elementOffsetY + elementRect.height / 2)

  return {
    x: finalX,
    y: finalY,
  }
}

function zoomToFitElement(e: HTMLElement) {
  // 1. Calculate the dimensions of the element and the viewport
  // 2. Calculate the scaling factor based on the dimensions of the element and the viewport
  // 3. Set the zoom level of the container element to the calculated scale factor
  const viewport = document.querySelector<HTMLElement>(panzoomChild)
  const elementRect = e.getBoundingClientRect()

  if (!viewport || !elementRect) {
    console.error('Failed to get element')
    return false
  }

  const viewportWidth = viewport.offsetWidth
  const viewportHeight = viewport.offsetHeight

  const elementWidth = elementRect.width
  const elementHeight = elementRect.height

  const zoomPadding = 0.9 // add extra space on sides of the content
  const zoomX =
    (viewportWidth / (elementRect.left + elementWidth)) * zoomPadding
  const zoomY =
    (viewportHeight / (elementRect.top + elementHeight)) * zoomPadding

  const scaleFactor = Math.min(zoomX, zoomY)

  console.log('Zooom', scaleFactor, viewport, e)

  return scaleFactor
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

  const { el: container } = getPanzoomElement('container')
  if (!container) {
    console.error('No container')
    return 1
  }

  const panzoomViewportRect = {
    width: viewport.offsetWidth,
    height: viewport.offsetHeight,
  }
  const childRect = container.getBoundingClientRect()
  const childWidth = childRect.width
  const childHeight = childRect.height

  // Calculate the zoom scale
  const zoomPadding = 0.9 // add extra space on sides of the content
  const zoomX = (panzoomViewportRect.width / childWidth) * zoomPadding
  const zoomY = (panzoomViewportRect.height / childHeight) * zoomPadding
  let zoom = Math.min(zoomX, zoomY)

  // Return
  return zoom
}
