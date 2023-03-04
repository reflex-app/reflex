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

